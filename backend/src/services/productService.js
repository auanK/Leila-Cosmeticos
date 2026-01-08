import * as productRepository from '../repositories/productRepository.js';

export const getAllProducts = async (filters = {}) => {
    return await productRepository.findAll(filters);
};

export const createProduct = async (data) => {
    if (!data.name || !data.priceTo || !data.mainImage) {
        throw new Error('Nome, preço e imagem principal são obrigatórios');
    }

    if (!data.categoryIds || !Array.isArray(data.categoryIds) || data.categoryIds.length === 0) {
        throw new Error('O produto precisa pertencer a pelo menos uma categoria.');
    }

    return await productRepository.create(data);
};

export const getRelatedProducts = async (productId) => {
    return await productRepository.findRelated(productId);
};