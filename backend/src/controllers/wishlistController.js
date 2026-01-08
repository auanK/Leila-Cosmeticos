import * as wishlistRepository from '../repositories/wishlistRepository.js';

export const list = async (req, res) => {
    try {
        const items = await wishlistRepository.list(req.user.id);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const add = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'ID do produto é obrigatório' });
        }

        await wishlistRepository.add(req.user.id, productId);
        res.status(201).json({ message: 'Produto adicionado à wishlist' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const { productId } = req.params;
        await wishlistRepository.remove(req.user.id, productId);
        res.json({ message: 'Produto removido da wishlist' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};