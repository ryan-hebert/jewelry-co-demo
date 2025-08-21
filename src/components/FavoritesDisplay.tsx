import { useFavorites } from '../contexts/FavoritesContext';
import HeartIcon from './HeartIcon';
import JewelryViewer from './JewelryViewer';
import type { CartItem } from '../types/order';

interface FavoritesDisplayProps {
  onAddToCart: (item: CartItem) => void;
}

export default function FavoritesDisplay({ onAddToCart }: FavoritesDisplayProps) {
  const { state, removeFavorite } = useFavorites();

  const handleRemoveFavorite = async (id: string) => {
    await removeFavorite(id);
  };

  const handleAddToCart = (favorite: any) => {
    const cartItem: CartItem = {
      productId: favorite.productId,
      productName: favorite.productName,
      metal: favorite.metal,
      stone: favorite.stone,
      caratSize: favorite.caratSize,
      ringSize: favorite.ringSize,
      necklaceSize: favorite.necklaceSize,
      price: favorite.price,
    };
    onAddToCart(cartItem);
  };

  if (state.loading) {
    return (
      <div className="favorites-display">
        <div className="favorites-loading">
          <div className="favorites-loading-spinner"></div>
          <h2>Loading your favorites...</h2>
          <p>Just a moment while we gather your saved designs</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="favorites-display">
        <div className="error">
          <h2>Error</h2>
          <p>{state.error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="favorites-display">
        <div className="empty-state">
          <h2>No Favorites Yet</h2>
          <p>Start customizing jewelry to add your favorite designs here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-display">
      <h2>Your Favorite Designs</h2>
      <p>Your saved jewelry designs ({state.count} items)</p>
      
      <div className="favorites-grid">
        {state.items.map((favorite) => {
          const isRing = favorite.productName.toLowerCase().includes('ring');
          const productType = isRing ? 'ring' : 'necklace';
          
          return (
            <div key={favorite.id} className="favorite-card">
              <div className="favorite-card-header">
                <h3>{favorite.productName}</h3>
                <HeartIcon
                  isFavorited={true}
                  onToggle={() => handleRemoveFavorite(favorite.id)}
                  size="small"
                  className="heart-icon--top-right"
                />
              </div>
              
              <div className="favorite-card-preview">
                <JewelryViewer
                  productType={productType}
                  metal={favorite.metal.toLowerCase() as 'silver' | 'gold' | 'rose gold'}
                />
                <div className="preview-summary">
                  {favorite.metal.toLowerCase()} {productType} • {favorite.stone} ({favorite.caratSize})
                  {isRing && favorite.ringSize && ` • Size ${favorite.ringSize}`}
                  {!isRing && favorite.necklaceSize && ` • ${favorite.necklaceSize}`}
                </div>
              </div>
              
              <div className="favorite-card-details">
                
                <div className="favorite-price">
                  <span className="price-amount">${favorite.price.toFixed(2)}</span>
                </div>
                
                <div className="favorite-actions">
                  <button
                    className="btn btn-gold"
                    onClick={() => handleAddToCart(favorite)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
