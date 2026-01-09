import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import type { User } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string, cpf?: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'user';

interface StoredUserData {
  user: User;
  token: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredData = () => {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const { user: storedUser, token: storedToken }: StoredUserData = JSON.parse(storedData);
          setUser(storedUser);
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          await api.getMe();
        } catch {
          logout();
        }
      }
    };

    if (!isLoading && token) {
      verifyToken();
    }
  }, [token, isLoading]);

  const saveToStorage = (userData: User, authToken: string) => {
    const dataToStore: StoredUserData = {
      user: userData,
      token: authToken,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  };

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    setUser(response.user);
    setToken(response.token);
    saveToStorage(response.user, response.token);
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string, cpf?: string, phone?: string): Promise<void> => {
    if (password !== confirmPassword) {
      throw new Error('As senhas não coincidem');
    }

    await api.register({ name, email, password, cpf, phone });
    
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user && token) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      saveToStorage(updatedUser, token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
