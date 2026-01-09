import * as reviewService from '../services/reviewService.js';

export const create = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { rating, comment } = req.body;

        const review = await reviewService.addReview(userId, productId, rating, comment);
        res.status(201).json(review);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const list = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await reviewService.getReviews(productId);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listUserReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const reviews = await reviewService.getUserReviews(userId);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getReviewedProducts = async (req, res) => {
    try {
        const userId = req.user.id;
        const productIds = await reviewService.getReviewedProductIds(userId);
        res.json(productIds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};