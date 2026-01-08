import * as cartRepository from '../repositories/cartRepository.js';
import pool from '../config/db.js';

export const getMyCart = async (userId) => {
    let itemsRows = await cartRepository.findCartByUserId(userId);

    if (itemsRows.length === 0) {
        try { await cartRepository.createCart(userId); } catch (e) { }
        return { items: [], total: 0, isValid: true };
    }

    const cartId = itemsRows[0].cart_id;
    let isCartValid = true;

    const items = itemsRows.map(item => {
        const price = parseFloat(item.current_price);
        const subtotal = item.quantity * price;

        const isProductActive = item.is_active;
        const hasStock = item.quantity <= item.current_stock;

        if (!isProductActive || !hasStock) {
            isCartValid = false;
        }

        return {
            itemId: item.item_id,
            productId: item.product_id,
            name: item.name,
            image: item.main_image,
            price: price,
            quantity: item.quantity,
            subtotal: subtotal,
            currentStock: item.current_stock,
            error: !isProductActive
                ? 'Produto indisponível'
                : (!hasStock ? `Apenas ${item.current_stock} un. disponíveis` : null)
        };
    });

    const total = items.reduce((acc, item) => acc + item.subtotal, 0);

    return {
        cartId,
        items,
        total: parseFloat(total.toFixed(2)),
        isValid: isCartValid
    };
};

export const addToCart = async (userId, productId, quantity) => {
    if (!quantity || quantity <= 0) {
        throw new Error('A quantidade para adicionar deve ser maior que zero.');
    }

    let cartRows = await cartRepository.findCartByUserId(userId);
    let cartId;

    if (cartRows.length > 0) {
        cartId = cartRows[0].cart_id;
    } else {
        const checkCart = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
        if (checkCart.rows.length > 0) {
            cartId = checkCart.rows[0].id;
        } else {
            const newCart = await cartRepository.createCart(userId);
            cartId = newCart.id;
        }
    }

    const existingItem = cartRows.find(item => item.product_id === parseInt(productId));
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;

    const productRes = await pool.query('SELECT current_stock, is_active FROM products WHERE id = $1', [productId]);
    const product = productRes.rows[0];

    if (!product) throw new Error('Produto não encontrado.');
    if (!product.is_active) throw new Error('Produto indisponível para venda.');

    const totalDesired = currentQtyInCart + quantity;

    if (totalDesired > product.current_stock) {
        throw new Error(`Estoque insuficiente. Você já tem ${currentQtyInCart} no carrinho. Máximo disponível: ${product.current_stock}.`);
    }

    return await cartRepository.addItem(cartId, productId, quantity);
};

export const removeFromCart = async (userId, itemId) => {
    const checkCart = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    if (checkCart.rows.length === 0) throw new Error('Carrinho não encontrado');

    const cartId = checkCart.rows[0].id;
    await cartRepository.removeItem(itemId, cartId);
};

export const updateQuantity = async (userId, itemId, quantity) => {
    const cartRows = await cartRepository.findCartByUserId(userId);
    const item = cartRows.find(row => row.item_id === parseInt(itemId));

    if (!item) {
        throw new Error('Item não encontrado no seu carrinho.');
    }

    if (quantity > item.current_stock) {
        throw new Error(`Estoque insuficiente. O máximo disponível agora é ${item.current_stock} unidades.`);
    }

    if (quantity <= 0) {
        await cartRepository.removeItem(itemId, item.cart_id);
        return;
    }

    return await cartRepository.updateItemQuantity(itemId, quantity);
};