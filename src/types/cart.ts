import type { CartItem } from './order';

export interface CartResponse {
  items: CartItem[];
  total: number;
  itemCount: number;
}
