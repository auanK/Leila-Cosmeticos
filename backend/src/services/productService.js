import * as productRepository from '../repositories/productRepository.js';
import * as categoryRepository from '../repositories/categoryRepository.js';

export const getAllProducts = async () => {
    return await productRepository.findAll();
};

export const createProduct = async (data) => {
    if (!data.name || !data.priceTo || !data.categoryId) {
        throw new Error('Nome, preço e categoria são obrigatórios');
    }

    const categoryExists = await categoryRepository.findById(data.categoryId);
    if (!categoryExists) {
        throw new Error('Caategoria não existe');
    }

    return await productRepository.create(data);
};