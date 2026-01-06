import * as categoryRepository from '../repositories/categoryRepository.js';

export const getAllCategories = async () => {
    return await categoryRepository.findAll();
};

export const createCategory = async (name, description, isFeatured) => {
    if (!name) throw new Error('O nome da categoria é obrigatório.');
    return await categoryRepository.create(name, description, isFeatured);
};