import type { Product } from '../types/product';
import type { CustomizationRequest, CustomizationResponse } from '../types/customization';
import type { CartResponse } from '../types/cart';
import type { CartItem, OrderRequest, Order } from '../types/order';
import type { AddFavoriteRequest, FavoritesResponse, CheckFavoriteResponse } from '../types/favorites';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/products');
  }

  // Customization
  async calculatePrice(request: CustomizationRequest): Promise<CustomizationResponse> {
    return this.request<CustomizationResponse>('/customize', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Cart
  async getCart(): Promise<CartResponse> {
    return this.request<CartResponse>('/cart');
  }

  async addToCart(item: CartItem): Promise<CartResponse> {
    return this.request<CartResponse>('/cart', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async removeFromCart(index: number): Promise<CartResponse> {
    return this.request<CartResponse>(`/cart/${index}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async checkout(request: OrderRequest): Promise<Order> {
    return this.request<Order>('/checkout', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>('/orders');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  // Favorites
  async getFavorites(): Promise<FavoritesResponse> {
    return this.request<FavoritesResponse>('/favorites');
  }

  async addToFavorites(request: AddFavoriteRequest): Promise<FavoritesResponse> {
    return this.request<FavoritesResponse>('/favorites', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async removeFromFavorites(id: string): Promise<FavoritesResponse> {
    return this.request<FavoritesResponse>(`/favorites/${id}`, {
      method: 'DELETE',
    });
  }

  async checkFavorite(productId: number, metal: string, stone: string, caratSize: string, ringSize?: string, necklaceSize?: string): Promise<CheckFavoriteResponse> {
    const params = new URLSearchParams({
      productId: productId.toString(),
      metal,
      stone,
      caratSize,
      ...(ringSize && { ringSize }),
      ...(necklaceSize && { necklaceSize }),
    });
    
    return this.request<CheckFavoriteResponse>(`/favorites/check?${params}`);
  }
}

export const apiService = new ApiService();
