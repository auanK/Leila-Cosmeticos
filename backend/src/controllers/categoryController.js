import * as categoryService from '../services/categoryService.js';

export const list = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const { name, description, is_featured } = req.body;
        const newCategory = await categoryService.createCategory(name, description, is_featured);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, is_featured } = req.body;
        const updatedCategory = await categoryService.updateCategory(id, name, description, is_featured);
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryService.deleteCategory(id);
        res.json({ message: 'Categoria removida com sucesso.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};