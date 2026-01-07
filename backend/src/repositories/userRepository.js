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