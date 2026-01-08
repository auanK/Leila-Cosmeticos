const API_BASE_URL = import.meta.env.API_URL || 'http://localhost:3000/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.token;
    }
    return null;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const token = this.getAuthToken();
    
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao fazer requisição');
    }

    return data;
  }

  async login(email: string, password: string) {
    return this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async register(userData: RegisterData) {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async getMe() {
    return this.request<{ message: string; userData: UserData }>('/users/me');
  }

  async getProducts() {
    return this.request<Product[]>('/products');
  }

  async getProduct(id: number): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find(p => p.id === id) || null;
  }

  async createProduct(productData: CreateProductData) {
    return this.request<Product>('/products', {
      method: 'POST',
      body: productData,
    });
  }

  async getCategories() {
    return this.request<Category[]>('/categories');
  }

  async createCategory(categoryData: CreateCategoryData) {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: categoryData,
    });
  }

  // Cart methods
  async getCart() {
    return this.request<Cart>('/cart');
  }

  async addToCart(productId: number, quantity: number = 1) {
    return this.request<{ message: string }>('/cart/add', {
      method: 'POST',
      body: { productId, quantity },
    });
  }

  async removeFromCart(itemId: number) {
    return this.request<{ message: string }>(`/cart/item/${itemId}`, {
      method: 'DELETE',
    });
  }

  async updateCartItem(itemId: number, quantity: number) {
    return this.request<{ message: string }>(`/cart/item/${itemId}`, {
      method: 'PUT',
      body: { quantity },
    });
  }
}

export interface User {
  id: number;
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  role?: string;
}

export interface UserData {
  userId: number;
  email: string;
  role: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  cpf?: string;
  phone?: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  price_from?: number;
  price_to?: number;
  current_stock?: number;
  brand?: string;
  skin_type?: string;
  weight_grams?: number;
  is_active?: boolean;
  main_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductData {
  category_id: number;
  name: string;
  description?: string;
  price_from?: number;
  price_to?: number;
  current_stock?: number;
  brand?: string;
  skin_type?: string;
  weight_grams?: number;
  is_active?: boolean;
  main_image?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  is_featured?: boolean;
}

export interface CartItem {
  itemId: number;
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
  currentStock: number;
  error: string | null;
}

export interface Cart {
  cartId?: number;
  items: CartItem[];
  total: number;
  isValid: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const api = new ApiService(API_BASE_URL);
