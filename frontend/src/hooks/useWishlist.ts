import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { WishlistItem } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface UseWishlistReturn {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  addItem: (productId: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  refresh: () => Promise<void>;
}

export function useWishlist(): UseWishlistReturn {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getWishlist();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar lista de desejos');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addItem = async (productId: number) => {
    try {
      setError(null);
      await api.addToWishlist(productId);
      await fetchWishlist();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar à lista de desejos';
      setError(errorMessage);
      throw err;
    }
  };

  const removeItem = async (productId: number) => {
    try {
      setError(null);
      await api.removeFromWishlist(productId);
      await fetchWishlist();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover da lista de desejos';
      setError(errorMessage);
      throw err;
    }
  };

  const isInWishlist = (productId: number) => {
    return items.some(item => item.id === productId);
  };

  return {
    items,
    loading,
    error,
    addItem,
    removeItem,
    isInWishlist,
    refresh: fetchWishlist,
  };
}
