import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Review } from '../services/api';

interface UseReviewsReturn {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  submitReview: (rating: number, comment: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useReviews(productId: number): UseReviewsReturn {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getProductReviews(productId);
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar avaliações');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = async (rating: number, comment: string) => {
    try {
      setError(null);
      await api.createReview(productId, rating, comment);
      await fetchReviews();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar avaliação';
      setError(errorMessage);
      throw err;
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = reviews.reduce((dist, r) => {
    dist[r.rating] = (dist[r.rating] || 0) + 1;
    return dist;
  }, {} as Record<number, number>);

  return {
    reviews,
    loading,
    error,
    averageRating,
    ratingDistribution,
    submitReview,
    refresh: fetchReviews,
  };
}
