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