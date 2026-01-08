import pool from '../config/db.js';

export const add = async (userId, productId) => {
    const query = `
        INSERT INTO wishlists (user_id, product_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, product_id) DO NOTHING
    `;
    await pool.query(query, [userId, productId]);
};

export const remove = async (userId, productId) => {
    const query = 'DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2';
    await pool.query(query, [userId, productId]);
};

export const list = async (userId) => {
    const query = `
        SELECT p.*, w.created_at as added_at 
        FROM wishlists w
        JOIN products p ON w.product_id = p.id
        WHERE w.user_id = $1
        ORDER BY w.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};