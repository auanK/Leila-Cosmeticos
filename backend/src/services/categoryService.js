import * as categoryRepository from '../repositories/categoryRepository.js';

export const getAllCategories = async () => {
    return await categoryRepository.findAll();
};

export const createCategory = async (name, description, isFeatured) => {
    if (!name) throw new Error('O nome da categoria é obrigatório.');
    return await categoryRepository.create(name, description, isFeatured);
};

export const updateCategory = async (id, name, description, isFeatured) => {
    if (!name) throw new Error('O nome da categoria é obrigatório.');
    
    const existing = await categoryRepository.findById(id);
    if (!existing) throw new Error('Categoria não encontrada.');
    
    return await categoryRepository.update(id, name, description, isFeatured);
};

export const deleteCategory = async (id) => {
    const existing = await categoryRepository.findById(id);
    if (!existing) throw new Error('Categoria não encontrada.');
    
    return await categoryRepository.remove(id);
};