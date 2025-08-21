// Define FavoriteItem interface for favorites functionality
export interface FavoriteItem {
  id: string;
  productId: number;
  productName: string;
  metal: string;
  stone: string;
  caratSize: string;
  ringSize?: string;
  necklaceSize?: string;
  price: number;
  createdAt: string;
}

export interface AddFavoriteRequest {
  productId: number;
  productName: string;
  metal: string;
  stone: string;
  caratSize: string;
  ringSize?: string;
  necklaceSize?: string;
  price: number;
}

export interface FavoritesResponse {
  items: FavoriteItem[];
  count: number;
  message?: string;
}

export interface CheckFavoriteResponse {
  isFavorited: boolean;
}
