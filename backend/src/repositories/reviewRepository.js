import pool from '../config/db.js';

export const hasPurchased = async (userId, productId) => {
    const query = `
        SELECT 1 
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.user_id = $1 AND oi.product_id = $2
        LIMIT 1
    `;
    const result = await pool.query(query, [userId, productId]);
    return result.rowCount > 0;
};

export const create = async (userId, productId, rating, comment) => {
    const query = `
        INSERT INTO reviews (user_id, product_id, rating, comment)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const result = await pool.query(query, [userId, productId, rating, comment]);
    return result.rows[0];
};

export const listByProduct = async (productId) => {
    const query = `
        SELECT 
            r.id,
            r.rating, 
            r.comment, 
            r.created_at,
            u.name as user_name,
            u.profile_image as user_photo
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.product_id = $1
        ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query, [productId]);
    return result.rows;
};