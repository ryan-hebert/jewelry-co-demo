import { useState, useEffect } from 'react';
import type { Product } from './types/product';
import type { CartItem, Order } from './types/order';
import { apiService } from './services/api';
import ProductCustomizer from './components/ProductCustomizer.tsx';
import ShoppingCart from './components/ShoppingCart.tsx';
import Checkout from './components/Checkout.tsx';
import OrderConfirmation from './components/OrderConfirmation.tsx';
import { PriceTicker } from './components/PriceTicker.tsx';
import './App.css';

type AppState = 'customizer' | 'cart' | 'checkout' | 'confirmation';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('customizer');
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Load cart on component mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await apiService.getProducts();
      setProducts(productsData);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const cartData = await apiService.getCart();
      setCartItems(cartData.items);
      setCartTotal(cartData.total);
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  const handleAddToCart = async (item: CartItem) => {
    try {
      const cartData = await apiService.addToCart(item);
      setCartItems(cartData.items);
      setCartTotal(cartData.total);
      setCurrentState('cart');
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Error adding to cart:', err);
    }
  };

  const handleRemoveFromCart = async (index: number) => {
    try {
      const cartData = await apiService.removeFromCart(index);
      setCartItems(cartData.items);
      setCartTotal(cartData.total);
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error('Error removing from cart:', err);
    }
  };

  const handleCheckout = async (customerName: string, customerEmail: string) => {
    try {
      const orderData = await apiService.checkout({ customerName, customerEmail });
      setOrder(orderData);
      setCartItems([]);
      setCartTotal(0);
      setCurrentState('confirmation');
    } catch (err) {
      setError('Failed to process checkout');
      console.error('Error during checkout:', err);
    }
  };

  const handleContinueShopping = () => {
    setCurrentState('customizer');
    setOrder(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

    return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>Ryan H Jewelry Co.</h1>
          <nav className="app-nav">
            <button
              className={`btn ${currentState === 'customizer' ? 'btn-active' : 'btn-ghost'}`}
              onClick={() => setCurrentState('customizer')}
            >
              Customize
            </button>
            <button
              className={`btn ${currentState === 'cart' ? 'btn-active' : 'btn-ghost'}`}
              onClick={() => setCurrentState('cart')}
            >
              Cart ({cartItems.length})
            </button>
          </nav>
        </div>
      </header>

      <PriceTicker />

      <main className="app-main">
        <div className="container">
        {currentState === 'customizer' && (
          <ProductCustomizer 
            products={products}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentState === 'cart' && (
          <ShoppingCart 
            items={cartItems}
            total={cartTotal}
            onRemoveItem={handleRemoveFromCart}
            onProceedToCheckout={() => setCurrentState('checkout')}
            onContinueShopping={() => setCurrentState('customizer')}
          />
        )}

        {currentState === 'checkout' && (
          <Checkout 
            items={cartItems}
            total={cartTotal}
            onCheckout={handleCheckout}
            onBackToCart={() => setCurrentState('cart')}
          />
        )}

        {currentState === 'confirmation' && order && (
          <OrderConfirmation 
            order={order}
            onContinueShopping={handleContinueShopping}
          />
        )}
        </div>
      </main>
      
      <footer className="app-footer">
        <div className="container">
          © {new Date().getFullYear()} Ryan H Jewelry Co. Demo • Weekdays 8AM–7PM CST • 337-290-5522
        </div>
      </footer>
    </div>
  );
}

export default App;
