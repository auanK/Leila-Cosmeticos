import * as reviewRepository from '../repositories/reviewRepository.js';

export const addReview = async (userId, productId, rating, comment) => {
    if (rating < 1 || rating > 5) {
        throw new Error('A nota deve ser entre 1 e 5.');
    }

    const purchased = await reviewRepository.hasPurchased(userId, productId);


    if (!purchased) {
        throw new Error('Você precisa comprar este produto antes de avaliá-lo.');
    }

    try {
        return await reviewRepository.create(userId, productId, rating, comment);
    } catch (error) {
        if (error.code === '23505') {
            throw new Error('Você já avaliou este produto.');
        }
        throw error;
    }
};

export const getReviews = async (productId) => {
    return await reviewRepository.listByProduct(productId);
};

export const getUserReviews = async (userId) => {
    return await reviewRepository.listByUser(userId);
};

export const getReviewedProductIds = async (userId) => {
    return await reviewRepository.getReviewedProductIds(userId);
};