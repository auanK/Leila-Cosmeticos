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

export const update = async (id, data) => {
    const query = `
        UPDATE categories 
        SET name = COALESCE($1, name),
            description = COALESCE($2, description),
            is_featured = COALESCE($3, is_featured)
        WHERE id = $4
        RETURNING *
    `;
    const result = await pool.query(query, [data.name, data.description, data.isFeatured, id]);
    return result.rows[0];
};

export const remove = async (id) => {
    // Verificar se há produtos associados
    const checkQuery = 'SELECT COUNT(*) FROM product_categories WHERE category_id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    if (parseInt(checkResult.rows[0].count) > 0) {
        throw new Error('Não é possível excluir categoria com produtos associados');
    }
    
    const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};