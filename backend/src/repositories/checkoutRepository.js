import pool from '../config/db.js';

export const processCheckout = async (userId, cartItems, totalAmount, clearCart = true) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const orderQuery = `
            INSERT INTO orders (user_id, total_amount, status)
            VALUES ($1, $2, 'PAGO')
            RETURNING id, created_at
        `;
        const orderRes = await client.query(orderQuery, [userId, totalAmount]);
        const newOrder = orderRes.rows[0];

        for (const item of cartItems) {
            const stockCheck = await client.query('SELECT current_stock FROM products WHERE id = $1', [item.productId]);
            if (stockCheck.rows[0].current_stock < item.quantity) {
                throw new Error(`Estoque insuficiente para o produto ID ${item.productId} durante o processamento.`);
            }

            await client.query(`
                INSERT INTO order_items (order_id, product_id, quantity, unit_price)
                VALUES ($1, $2, $3, $4)
            `, [newOrder.id, item.productId, item.quantity, item.price]);

            await client.query(`
                UPDATE products 
                SET current_stock = current_stock - $1 
                WHERE id = $2
            `, [item.quantity, item.productId]);
        }

        if (clearCart) {
            await client.query(`
                DELETE FROM cart_items 
                USING carts 
                WHERE cart_items.cart_id = carts.id AND carts.user_id = $1
            `, [userId]);
        }

        await client.query('COMMIT');
        return newOrder;

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};