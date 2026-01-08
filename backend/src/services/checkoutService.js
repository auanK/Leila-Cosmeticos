import * as cartRepository from '../repositories/cartRepository.js';
import * as checkoutRepository from '../repositories/checkoutRepository.js';
import * as addressRepository from '../repositories/addressRepository.js';
import * as productRepository from '../repositories/productRepository.js';

export const executeCheckout = async (userId, addressId, productId = null, quantity = 1) => {
    const addresses = await addressRepository.findAllByUserId(userId);
    const selectedAddress = addresses.find(addr => addr.id === parseInt(addressId));

    if (!selectedAddress) {
        throw new Error('Endereço de entrega inválido ou não pertence a este usuário.');
    }

    let itemsToProcess = [];
    let totalAmount = 0;
    let shouldClearCart = true;

    if (productId) {
        shouldClearCart = false;

        const product = await productRepository.findById(productId);
        if (!product) throw new Error('Produto não encontrado.');
        if (!product.is_active) throw new Error('Este produto não está mais disponível.');
        if (product.current_stock < quantity) throw new Error('Estoque insuficiente para este produto.');

        const price = parseFloat(product.price_to);

        itemsToProcess.push({
            productId: product.id,
            quantity: parseInt(quantity),
            price: price
        });

        totalAmount = price * parseInt(quantity);

    } else {
        const cartItemsRaw = await cartRepository.findCartByUserId(userId);

        if (cartItemsRaw.length === 0) {
            throw new Error('Seu carrinho está vazio.');
        }

        itemsToProcess = cartItemsRaw.map(item => {
            const price = parseFloat(item.current_price);

            if (!item.is_active) throw new Error(`O produto "${item.name}" não está mais disponível.`);
            if (item.quantity > item.current_stock) throw new Error(`Estoque insuficiente para "${item.name}".`);

            totalAmount += price * item.quantity;

            return {
                productId: item.product_id,
                quantity: item.quantity,
                price: price
            };
        });
    }

    return await checkoutRepository.processCheckout(userId, itemsToProcess, totalAmount, shouldClearCart);
};