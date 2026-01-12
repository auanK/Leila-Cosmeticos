import pool from '../config/db.js';

export const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

export const createUser = async (userData) => {
    const { name, email, passwordHash, cpf, phone, isAdmin } = userData;

    const query = `
        INSERT INTO users (name, email, password_hash, cpf, phone, is_admin)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    const values = [name, email, passwordHash, cpf, phone, isAdmin || false];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const findById = async (id) => {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const update = async (userId, data) => {
    const query = `
        UPDATE users
        SET 
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            phone = COALESCE($3, phone),
            password_hash = COALESCE($4, password_hash),
            profile_image = COALESCE($5, profile_image)
        WHERE id = $6
        RETURNING *; -- Alterado: O asterisco retorna a linha inteira atualizada
    `;

    const values = [
        data.name || null,
        data.email || null,
        data.phone || null,
        data.passwordHash || null,
        data.profileImage || null,
        userId
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};

export const findAll = async () => {
    const query = `
        SELECT 
            u.id, 
            u.name, 
            u.email, 
            u.cpf, 
            u.phone, 
            u.is_admin, 
            u.profile_image, 
            u.created_at,
            COALESCE(SUM(o.total_amount), 0) as total_spent,
            MAX(o.created_at) as last_order_date,
            COUNT(o.id) as order_count
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        GROUP BY u.id
        ORDER BY u.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
};