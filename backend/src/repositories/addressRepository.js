import pool from '../config/db.js';

export const findAllByUserId = async (userId) => {
    const query = 'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_main DESC, id ASC';
    const result = await pool.query(query, [userId]);
    return result.rows;
};

export const create = async (userId, data) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        if (data.isMain) {
            await client.query(
                'UPDATE addresses SET is_main = false WHERE user_id = $1',
                [userId]
            );
        } else {
            const countRes = await client.query('SELECT COUNT(*) FROM addresses WHERE user_id = $1', [userId]);
            if (parseInt(countRes.rows[0].count) === 0) {
                data.isMain = true;
            }
        }

        const query = `
            INSERT INTO addresses (user_id, street, number, complement, neighborhood, city, state, zip_code, is_main)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const values = [
            userId, data.street, data.number, data.complement,
            data.neighborhood, data.city, data.state, data.zipCode, data.isMain
        ];

        const result = await client.query(query, values);

        await client.query('COMMIT');
        return result.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const remove = async (addressId, userId) => {
    const query = 'DELETE FROM addresses WHERE id = $1 AND user_id = $2';
    await pool.query(query, [addressId, userId]);
};

export const update = async (addressId, userId, data) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        if (data.isMain) {
            await client.query(
                'UPDATE addresses SET is_main = false WHERE user_id = $1',
                [userId]
            );
        }

        const query = `
            UPDATE addresses 
            SET street = $1, number = $2, complement = $3, 
                neighborhood = $4, city = $5, state = $6, 
                zip_code = $7, is_main = $8
            WHERE id = $9 AND user_id = $10
            RETURNING *
        `;

        const values = [
            data.street, data.number, data.complement,
            data.neighborhood, data.city, data.state,
            data.zipCode, data.isMain,
            addressId, userId
        ];

        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            throw new Error('Endereço não encontrado ou não pertence a este usuário.');
        }

        await client.query('COMMIT');
        return result.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};