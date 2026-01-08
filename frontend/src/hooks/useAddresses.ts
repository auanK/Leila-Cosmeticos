import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { Address, CreateAddressData } from '../services/api';

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getAddresses();
      setAddresses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar endereços');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const addAddress = async (addressData: CreateAddressData) => {
    try {
      const newAddress = await api.createAddress(addressData);
      setAddresses(prev => [...prev, newAddress]);
      return newAddress;
    } catch (err) {
      throw err;
    }
  };

  const updateAddress = async (id: number, addressData: Partial<CreateAddressData>) => {
    try {
      const updated = await api.updateAddress(id, addressData);
      setAddresses(prev => prev.map(addr => addr.id === id ? updated : addr));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const removeAddress = async (id: number) => {
    try {
      await api.deleteAddress(id);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    addresses,
    isLoading,
    error,
    refresh: fetchAddresses,
    addAddress,
    updateAddress,
    removeAddress
  };
}
