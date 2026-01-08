import * as checkoutService from '../services/checkoutService.js';

export const checkout = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId, productId, quantity } = req.body;

        if (!addressId) {
            return res.status(400).json({ error: 'É obrigatório selecionar um endereço de entrega.' });
        }

        const order = await checkoutService.executeCheckout(userId, addressId, productId, quantity);

        res.status(201).json({
            message: 'Compra realizada com sucesso!',
            orderId: order.id,
            date: order.created_at
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};