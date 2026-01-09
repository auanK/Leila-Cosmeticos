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

export const listByUser = async (userId) => {
    const query = `
        SELECT 
            r.id,
            r.product_id,
            r.rating, 
            r.comment, 
            r.created_at,
            p.name as product_name,
            p.main_image as product_image
        FROM reviews r
        JOIN products p ON r.product_id = p.id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

export const getReviewedProductIds = async (userId) => {
    const query = `SELECT product_id FROM reviews WHERE user_id = $1`;
    const result = await pool.query(query, [userId]);
    return result.rows.map(r => r.product_id);
};