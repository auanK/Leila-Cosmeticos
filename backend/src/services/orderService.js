import * as orderRepository from '../repositories/orderRepository.js';

export const getMyOrders = async (userId) => {
    return await orderRepository.findAllByUserId(userId);
};

export const getAllOrders = async () => {
    return await orderRepository.findAll();
};

export const getOrderById = async (id) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new Error('Pedido não encontrado.');
    return order;
};

export const updateOrderStatus = async (id, status) => {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        throw new Error('Status inválido.');
    }
    
    const order = await orderRepository.findById(id);
    if (!order) throw new Error('Pedido não encontrado.');
    
    return await orderRepository.updateStatus(id, status);
};