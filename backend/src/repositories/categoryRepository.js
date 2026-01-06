import pool from '../config/db.js';

export const findAll = async () => {
    const query = 'SELECT * FROM categories ORDER BY id ASC';
    const result = await pool.query(query);
    return result.rows;
};

export const findById = async (id) => {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const create = async (name, description, isFeatured) => {
    const query = `
        INSERT INTO categories (name, description, is_featured)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const result = await pool.query(query, [name, description, isFeatured || false]);
    return result.rows[0];
};