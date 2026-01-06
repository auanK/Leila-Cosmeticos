import * as productRepository from '../repositories/productRepository.js';
import * as categoryRepository from '../repositories/categoryRepository.js';

export const getAllProducts = async () => {
    return await productRepository.findAll();
};

export const createProduct = async (data) => {
    if (!data.name || !data.priceTo || !data.categoryId || !data.mainImage) {
        throw new Error('Nome, preço, categoria e imagem principal são obrigatórios.');
    }

    const categoryExists = await categoryRepository.findById(data.categoryId);
    if (!categoryExists) {
        throw new Error('Categoria não existe');
    }

    return await productRepository.create(data);
};