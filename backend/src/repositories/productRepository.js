import pool from '../config/db.js';

export const findAll = async () => {
    const query = `
        SELECT p.*, c.name as category_name 
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = true
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const create = async (data) => {
    const {
        categoryId, name, description, priceFrom, priceTo,
        currentStock, brand, skinType, weightGrams, isActive,
        mainImage
    } = data;

    const query = `
        INSERT INTO products (
            category_id, name, description, price_from, price_to, 
            current_stock, brand, skin_type, weight_grams, is_active,
            main_image
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
    `;

    const values = [
        categoryId, name, description, priceFrom, priceTo,
        currentStock, brand, skinType, weightGrams, isActive ?? true, mainImage
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};