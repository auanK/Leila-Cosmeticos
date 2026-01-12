import pool from '../config/db.js';

export const findAllByUserId = async (userId) => {
    const query = `
        SELECT 
            o.id, 
            o.total_amount, 
            o.status, 
            o.created_at,
            json_agg(
                json_build_object(
                    'product_id', p.id,
                    'name', p.name,
                    'quantity', oi.quantity,
                    'unit_price', oi.unit_price,
                    'image', p.main_image
                )
            ) as items
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
};

export const findAll = async () => {
    const query = `
        SELECT 
            o.id, 
            o.user_id,
            o.total_amount, 
            o.status, 
            o.created_at,
            u.name as user_name,
            u.email as user_email,
            u.profile_image as user_photo,
            json_agg(
                json_build_object(
                    'product_id', p.id,
                    'name', p.name,
                    'quantity', oi.quantity,
                    'unit_price', oi.unit_price,
                    'image', p.main_image
                )
            ) as items
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        JOIN users u ON o.user_id = u.id
        GROUP BY o.id, u.id
        ORDER BY o.created_at DESC
    `;

    const result = await pool.query(query);
    return result.rows;
};

export const findById = async (id) => {
    const query = `
        SELECT 
            o.id, 
            o.user_id,
            o.total_amount, 
            o.status, 
            o.created_at,
            u.name as user_name,
            u.email as user_email,
            u.phone as user_phone,
            u.profile_image as user_photo,
            a.street, a.number, a.complement, a.neighborhood, a.city, a.state, a.zip_code,
            json_agg(
                json_build_object(
                    'product_id', p.id,
                    'name', p.name,
                    'quantity', oi.quantity,
                    'unit_price', oi.unit_price,
                    'image', p.main_image
                )
            ) as items
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        JOIN users u ON o.user_id = u.id
        LEFT JOIN addresses a ON o.shipping_address_id = a.id
        WHERE o.id = $1
        GROUP BY o.id, u.id, a.id
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const updateStatus = async (id, status) => {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        throw new Error('Status inválido');
    }
    
    const query = `
        UPDATE orders 
        SET status = $1 
        WHERE id = $2 
        RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
};