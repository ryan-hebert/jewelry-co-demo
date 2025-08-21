import { useState } from 'react';
import type { CartItem } from '../types/order';

interface CheckoutProps {
  items: CartItem[];
  total: number;
  onCheckout: (customerName: string, customerEmail: string) => void;
  onBackToCart: () => void;
}

export default function Checkout({ items, total, onCheckout, onBackToCart }: CheckoutProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!customerName.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!customerEmail.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onCheckout(customerName.trim(), customerEmail.trim());
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      
      {/* Order Summary */}
      <div className="checkout-summary">
        <h3>Order Summary</h3>
        {items.map((item, index) => (
          <div key={index} className="summary-item">
            <div>
              <strong>{item.productName}</strong>
              <div style={{ fontSize: '0.875rem', color: 'var(--fg)', opacity: 0.7 }}>
                {item.metal} • {item.stone} • Carat: {item.caratSize} • Ring Size: {item.ringSize}
              </div>
            </div>
            <span className="price">${item.price.toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-total">
          <div>Total: <span className="price">${total.toFixed(2)}</span></div>
        </div>
      </div>

      {/* Customer Information Form */}
      <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="customerName">Full Name *</label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={errors.name ? 'error' : ''}
                placeholder="Enter your full name"
                disabled={loading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="customerEmail">Email Address *</label>
              <input
                type="email"
                id="customerEmail"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email address"
                disabled={loading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="checkout-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={onBackToCart}
                disabled={loading}
              >
                Back to Cart
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      );
}
