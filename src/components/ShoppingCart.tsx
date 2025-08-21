import type { CartItem } from '../types/order';

interface ShoppingCartProps {
  items: CartItem[];
  total: number;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export default function ShoppingCart({ 
  items, 
  total, 
  onRemoveItem, 
  onProceedToCheckout, 
  onContinueShopping 
}: ShoppingCartProps) {
  if (items.length === 0) {
    return (
      <div className="shopping-cart">
        <h2>Your Cart</h2>
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <button className="btn btn-primary" onClick={onContinueShopping}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      <h2>Your Cart</h2>
      
      <div className="cart-items">
        {items.map((item, index) => (
          <div key={index} className="cart-item">
            <div className="cart-item-info">
              <h4>{item.productName}</h4>
              <div className="cart-item-details">
                Metal: {item.metal} • Stone: {item.stone} • Carat: {item.caratSize} • Ring Size: {item.ringSize}
              </div>
            </div>
            <div className="cart-item-price">
              <span className="price">${item.price.toFixed(2)}</span>
              <button 
                className="btn btn-ghost"
                onClick={() => onRemoveItem(index)}
                aria-label="Remove item"
                style={{ padding: '0.5rem', minWidth: 'auto' }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <div className="total-amount">${total.toFixed(2)}</div>
      </div>
      
      <div className="cart-actions">
        <button className="btn btn-secondary" onClick={onContinueShopping}>
          Continue Shopping
        </button>
        <button 
          className="btn btn-primary"
          onClick={onProceedToCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
