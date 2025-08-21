import type { Order } from '../types/order';

interface OrderConfirmationProps {
  order: Order;
  onContinueShopping: () => void;
}

export default function OrderConfirmation({ order, onContinueShopping }: OrderConfirmationProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="order-confirmation">
      <div className="success-icon">✓</div>
      <h2>Order Confirmed!</h2>
      <p>Thank you for your purchase. Your order has been successfully placed.</p>

      <div className="order-details">
        <h3>Order Information</h3>
        <div className="order-info">
          <div>
            <span className="label">Order ID:</span>
            <span className="value">{order.id}</span>
          </div>
          <div>
            <span className="label">Order Date:</span>
            <span className="value">{formatDate(order.createdAt)}</span>
          </div>
          <div>
            <span className="label">Customer:</span>
            <span className="value">{order.customerName}</span>
          </div>
          <div>
            <span className="label">Email:</span>
            <span className="value">{order.customerEmail}</span>
          </div>
          <div>
            <span className="label">Total Amount:</span>
            <span className="value price">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="order-details">
        <h3>Items Ordered</h3>
        {order.items.map((item, index) => (
          <div key={index} style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--surface)', borderRadius: '6px' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{item.productName}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--fg)', opacity: 0.7, marginBottom: '0.5rem' }}>
              Metal: {item.metal} • Stone: {item.stone} • Carat: {item.caratSize} • Ring Size: {item.ringSize}
            </div>
            <div className="price">${item.price.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={onContinueShopping}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
