import * as cartService from '../services/cartService.js';

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await cartService.getMyCart(userId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        await cartService.addToCart(userId, productId, quantity || 1);
        res.status(200).json({ message: 'Item adicionado ao carrinho' });
    } catch (error) {
        console.error("Erro no Controller:", error.message);
        res.status(400).json({ error: error.message });
    }
};

export const removeItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;

        await cartService.removeFromCart(userId, itemId);
        res.status(200).json({ message: 'Item removido do carrinho.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const { quantity } = req.body;

        await cartService.updateQuantity(userId, itemId, quantity);
        res.status(200).json({ message: 'Quantidade atualizada' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};