// Define CartItem interface here to avoid circular dependencies
export interface CartItem {
  productId: number;
  productName: string;
  metal: string;
  stone: string;
  caratSize: string;
  ringSize?: string;
  necklaceSize?: string;
  price: number;
}

export interface OrderRequest {
  customerName: string;
  customerEmail: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  createdAt: string;
}
