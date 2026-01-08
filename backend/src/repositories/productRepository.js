import pool from '../config/db.js';

export const findAll = async (filters = {}) => {
    let query = `
        SELECT p.*, 
               array_agg(c.name) as category_names,
               array_agg(c.id) as category_ids
        FROM products p
        LEFT JOIN product_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        WHERE p.is_active = true
    `;

    const values = [];
    let counter = 1;

    if (filters.search) {
        query += ` AND p.name ILIKE $${counter}`;
        values.push(`%${filters.search}%`);
        counter++;
    }

    query += ` GROUP BY p.id`;

    if (filters.categoryId) {
        query += ` HAVING $${counter} = ANY(array_agg(c.id))`;
        values.push(parseInt(filters.categoryId));
        counter++;
    }

    query += ` ORDER BY p.id ASC`;

    const result = await pool.query(query, values);
    return result.rows;
};

export const findById = async (id) => {
    const query = `
        SELECT p.*, 
               array_agg(c.name) as category_names,
               array_agg(c.id) as category_ids
        FROM products p
        LEFT JOIN product_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        WHERE p.id = $1
        GROUP BY p.id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const create = async (data) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const {
            categoryIds, name, description, priceFrom, priceTo,
            currentStock, brand, skinType, weightGrams, isActive, mainImage
        } = data;

        const insertProductQuery = `
            INSERT INTO products (
                name, description, price_from, price_to, 
                current_stock, brand, skin_type, weight_grams, is_active, main_image
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, name, price_to, current_stock
        `;

        const productValues = [
            name, description, priceFrom, priceTo,
            currentStock, brand, skinType, weightGrams, isActive ?? true, mainImage
        ];

        const productResult = await client.query(insertProductQuery, productValues);
        const newProduct = productResult.rows[0];

        if (categoryIds && categoryIds.length > 0) {
            const insertRelationQuery = `
                INSERT INTO product_categories (product_id, category_id)
                VALUES ($1, $2)
            `;

            for (const catId of categoryIds) {
                await client.query(insertRelationQuery, [newProduct.id, catId]);
            }
        }

        await client.query('COMMIT');

        return { ...newProduct, categoryIds };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const findRelated = async (productId) => {
    const query = `
        SELECT * FROM products 
        WHERE id IN (
            SELECT product_id FROM product_categories 
            WHERE category_id IN (
                SELECT category_id FROM product_categories WHERE product_id = $1
            )
        )
        AND id != $1
        AND is_active = true
        ORDER BY RANDOM()
        LIMIT 4
    `;
    const result = await pool.query(query, [productId]);
    return result.rows;
};