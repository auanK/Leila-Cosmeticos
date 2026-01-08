import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Cart, CartItem } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface UseCartReturn {
  cart: Cart | null;
  items: CartItem[];
  total: number;
  isValid: boolean;
  loading: boolean;
  error: string | null;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useCart(): UseCartReturn {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getCart();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar carrinho');
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId: number, quantity: number = 1) => {
    try {
      setError(null);
      await api.addToCart(productId, quantity);
      await fetchCart();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar item';
      setError(errorMessage);
      throw err;
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      setError(null);
      await api.removeFromCart(itemId);
      await fetchCart();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover item';
      setError(errorMessage);
      throw err;
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(itemId);
    }

    try {
      setError(null);
      await api.updateCartItem(itemId, quantity);
      await fetchCart();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar quantidade';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    cart,
    items: cart?.items ?? [],
    total: cart?.total ?? 0,
    isValid: cart?.isValid ?? true,
    loading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    refresh: fetchCart,
  };
}
