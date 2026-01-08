import pool from '../config/db.js';

export const findCartByUserId = async (userId) => {
    const query = `
        SELECT 
            c.id as cart_id, 
            ci.id as item_id,
            ci.quantity,
            p.id as product_id,
            p.name,
            p.price_to as current_price,
            p.main_image,
            p.current_stock,
            p.is_active
        FROM carts c
        JOIN cart_items ci ON c.id = ci.cart_id
        JOIN products p ON ci.product_id = p.id
        WHERE c.user_id = $1
        ORDER BY ci.id ASC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

export const createCart = async (userId) => {
    const query = 'INSERT INTO carts (user_id) VALUES ($1) RETURNING id';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
};

export const addItem = async (cartId, productId, quantity) => {
    const query = `
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (cart_id, product_id) 
        DO UPDATE SET quantity = cart_items.quantity + $3
        RETURNING *
    `;
    const result = await pool.query(query, [cartId, productId, quantity]);
    return result.rows[0];
};

export const removeItem = async (itemId, cartId) => {
    const query = 'DELETE FROM cart_items WHERE id = $1 AND cart_id = $2';
    await pool.query(query, [itemId, cartId]);
};

export const updateItemQuantity = async (itemId, quantity) => {
    const query = 'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [quantity, itemId]);
    return result.rows[0];
};