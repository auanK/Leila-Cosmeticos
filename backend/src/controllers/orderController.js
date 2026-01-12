import * as orderService from '../services/orderService.js';

export const list = async (req, res) => {
    try {
        const orders = await orderService.getMyOrders(req.user.id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listAll = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await orderService.getOrderById(id);
        res.json(order);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedOrder = await orderService.updateOrderStatus(id, status);
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};