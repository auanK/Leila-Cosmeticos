import * as productRepository from '../repositories/productRepository.js';

export const getAllProducts = async (filters = {}) => {
    return await productRepository.findAll(filters);
};

export const getProductById = async (id) => {
    return await productRepository.findById(id);
};

export const createProduct = async (data) => {
    if (!data.name || !data.priceTo || !data.mainImage) {
        throw new Error('Nome, preço e imagem principal são obrigatórios');
    }

    if (!data.categoryIds || !Array.isArray(data.categoryIds) || data.categoryIds.length === 0) {
        throw new Error('O produto precisa pertencer a pelo menos uma categoria.');
    }

    if (data.additionalImages && !Array.isArray(data.additionalImages)) {
        throw new Error('Imagens adicionais devem ser enviadas como uma lista de URLs.');
    }

    return await productRepository.create(data);
};

export const getRelatedProducts = async (productId) => {
    return await productRepository.findRelated(productId);
};

export const updateProduct = async (id, data) => {
    if (!data.name || !data.priceTo || !data.mainImage) {
        throw new Error('Nome, preço e imagem principal são obrigatórios');
    }

    if (!data.categoryIds || !Array.isArray(data.categoryIds) || data.categoryIds.length === 0) {
        throw new Error('O produto precisa pertencer a pelo menos uma categoria.');
    }

    const existing = await productRepository.findById(id);
    if (!existing) throw new Error('Produto não encontrado.');

    return await productRepository.update(id, data);
};

export const deleteProduct = async (id) => {
    const existing = await productRepository.findById(id);
    if (!existing) throw new Error('Produto não encontrado.');

    return await productRepository.remove(id);
};