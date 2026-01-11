import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { User } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useClients = () => {
  const [clients, setClients] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!isAuthenticated) {
        setClients([]);
        setIsLoading(false);
        return;
      }
      const data = await api.getClients();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, isLoading, error, refetch: fetchClients };
};
