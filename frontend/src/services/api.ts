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
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(productData: CreateProductData) {
    return this.request<Product>('/products', {
      method: 'POST',
      body: productData,
    });
  }

  async updateProduct(id: number, productData: Partial<CreateProductData>) {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: productData,
    });
  }

  async deleteProduct(id: number) {
    return this.request<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
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

  async updateCategory(id: number, categoryData: Partial<CreateCategoryData>) {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: categoryData,
    });
  }

  async deleteCategory(id: number) {
    return this.request<{ message: string }>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin methods
  async getAdminUsers() {
    return this.request<AdminUser[]>('/admin/users');
  }

  async getAdminOrders() {
    return this.request<AdminOrder[]>('/admin/orders');
  }

  async getAdminOrder(id: number) {
    return this.request<AdminOrderDetail>(`/admin/orders/${id}`);
  }

  async updateOrderStatus(id: number, status: string) {
    return this.request<{ message: string }>(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: { status },
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

  // Address methods
  async getAddresses() {
    return this.request<Address[]>('/addresses');
  }

  async createAddress(addressData: CreateAddressData) {
    return this.request<Address>('/addresses', {
      method: 'POST',
      body: addressData,
    });
  }

  async updateAddress(id: number, addressData: Partial<CreateAddressData>) {
    return this.request<Address>(`/addresses/${id}`, {
      method: 'PUT',
      body: addressData,
    });
  }

  async deleteAddress(id: number) {
    return this.request<{ message: string }>(`/addresses/${id}`, {
      method: 'DELETE',
    });
  }

  // Related products
  async getRelatedProducts(productId: number) {
    return this.request<Product[]>(`/products/${productId}/related`);
  }

  // Checkout methods
  async checkoutCart(addressId: number) {
    return this.request<CheckoutResponse>('/checkout', {
      method: 'POST',
      body: { addressId },
    });
  }

  async checkoutBuyNow(addressId: number, productId: number, quantity: number) {
    return this.request<CheckoutResponse>('/checkout', {
      method: 'POST',
      body: { addressId, productId, quantity },
    });
  }

  // Wishlist methods
  async getWishlist() {
    return this.request<WishlistItem[]>('/wishlist');
  }

  async addToWishlist(productId: number) {
    return this.request<{ message: string }>('/wishlist', {
      method: 'POST',
      body: { productId },
    });
  }

  async removeFromWishlist(productId: number) {
    return this.request<{ message: string }>(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  }

  // Orders methods
  async getOrders() {
    return this.request<Order[]>('/orders');
  }

  // Reviews methods
  async getProductReviews(productId: number) {
    return this.request<Review[]>(`/products/${productId}/reviews`);
  }

  async createReview(productId: number, rating: number, comment: string) {
    return this.request<Review>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: { rating, comment },
    });
  }

  // User reviews
  async getUserReviews() {
    return this.request<UserReview[]>('/reviews/me');
  }

  async getReviewedProductIds() {
    return this.request<number[]>('/reviews/me/products');
  }

  // Update profile with image
  async updateProfile(data: UpdateProfileData) {
    return this.request<{ message: string; user: User }>('/users/me', {
      method: 'PUT',
      body: data,
    });
  }

  // Admin - Get all clients
  async getClients() {
    return this.request<User[]>('/admin/clients');
  }
}

export interface WishlistItem extends Product {
  added_at: string;
}

export interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  unit_price: string;
  image: string;
}

export interface Order {
  id: number;
  total_amount: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
  user_photo?: string;
}

export interface UserReview {
  id: number;
  product_id: number;
  rating: number;
  comment: string;
  created_at: string;
  product_name: string;
  product_image: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
  profile_image?: string;
}

export interface CheckoutResponse {
  message: string;
  orderId: number;
  date: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  role?: string;
  profile_image?: string;
  isAdmin?: boolean;
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

export interface ProductImage {
  id: number;
  url: string;
}

export interface Product {
  id: number;
  category_id?: number;
  category_ids?: number[];
  category_names?: string[];
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
  gallery?: ProductImage[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateProductData {
  category_id?: number;
  category_ids?: number[];
  additional_images?: string[];
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

export interface Address {
  id: number;
  user_id: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_main: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAddressData {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_main?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  is_admin: boolean;
  profile_image?: string;
  created_at: string;
  total_spent: string;
  last_order_date?: string;
  order_count: number;
}

export interface AdminOrder {
  id: number;
  user_id: number;
  total_amount: string;
  status: string;
  created_at: string;
  user_name: string;
  user_email: string;
  user_photo?: string;
  items: OrderItem[];
}

export interface AdminOrderDetail extends AdminOrder {
  user_phone?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export const api = new ApiService(API_BASE_URL);
