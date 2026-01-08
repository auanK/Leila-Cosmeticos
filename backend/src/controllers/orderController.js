import * as orderService from '../services/orderService.js';

export const list = async (req, res) => {
    try {
        const orders = await orderService.getMyOrders(req.user.id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};