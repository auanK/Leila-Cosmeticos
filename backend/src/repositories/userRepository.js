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
        RETURNING id, name, email, is_admin, created_at
    `;

    const values = [name, email, passwordHash, cpf, phone, isAdmin || false];
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const findById = async (id) => {
    const query = 'SELECT id, name, email, cpf, phone, is_admin, created_at FROM users WHERE id = $1';
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
            password_hash = COALESCE($4, password_hash)
        WHERE id = $5
        RETURNING id, name, email, phone, cpf, is_admin;
    `;

    const values = [
        data.name || null,
        data.email || null,
        data.phone || null,
        data.passwordHash || null,
        userId
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};