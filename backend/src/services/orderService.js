import * as orderRepository from '../repositories/orderRepository.js';

export const getMyOrders = async (userId) => {
    return await orderRepository.findAllByUserId(userId);
};