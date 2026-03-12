const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error ?? `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};

// Typed API helpers
import type { Product, Offer, Order, CartItemData, LoginResponse, OrderConfirmation, AdminOrder } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post<LoginResponse>('/auth/register', { name, email, password }),
};

export const productApi = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  create: (data: { name: string; price: number; stock: number; description: string }) =>
    api.post<Product>('/products', data),
  update: (id: number, data: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, data),
  delete: (id: number) => api.delete<{ message: string }>(`/products/${id}`),
};

export const offerApi = {
  getAll: () => api.get<Offer[]>('/offers'),
  create: (data: { productId: number; discountPercentage: number; startDate: string; endDate: string }) =>
    api.post<Offer>('/offers', data),
  delete: (id: number) => api.delete<{ message: string }>(`/offers/${id}`),
};

export const cartApi = {
  getCart: () => api.get<CartItemData[]>('/cart'),
  addToCart: (productId: number, quantity = 1) =>
    api.post<CartItemData[]>('/cart/add', { productId, quantity }),
  removeFromCart: (productId: number) =>
    api.post<CartItemData[]>('/cart/remove', { productId }),
};

export const orderApi = {
  getAll: () => api.get<Order[]>('/orders'),
  getById: (id: number) => api.get<Order>(`/orders/${id}`),
  create: (items: { productId: number; quantity: number }[]) =>
    api.post<OrderConfirmation>('/orders', { items }),
};

export const adminOrderApi = {
  getAll: () => api.get<AdminOrder[]>('/orders/admin/all'),
  updateStatus: (id: number, status: string) =>
    api.put<AdminOrder>(`/orders/admin/${id}/status`, { status }),
};

export default api;
