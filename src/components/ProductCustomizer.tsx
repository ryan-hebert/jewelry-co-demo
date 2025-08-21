import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types/product';
import type { CartItem } from '../types/order';
import { METAL_OPTIONS, STONE_OPTIONS, CARAT_OPTIONS, RING_SIZE_OPTIONS, NECKLACE_SIZE_OPTIONS } from '../types/customization';
import { apiService } from '../services/api';
import JewelryViewer from './JewelryViewer.tsx';

interface ProductCustomizerProps {
  products: Product[];
  onAddToCart: (item: CartItem) => void;
}

export default function ProductCustomizer({ products, onAddToCart }: ProductCustomizerProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMetal, setSelectedMetal] = useState<string>(METAL_OPTIONS[0]);
           const [selectedStone] = useState<string>(STONE_OPTIONS[0]); // Always Diamond
  const [selectedCaratSize, setSelectedCaratSize] = useState<string>(CARAT_OPTIONS[0]);
  const [selectedRingSize, setSelectedRingSize] = useState<string>(RING_SIZE_OPTIONS[0]);
  const [selectedNecklaceSize, setSelectedNecklaceSize] = useState<string>(NECKLACE_SIZE_OPTIONS[0]);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounced price calculation
  const debouncedCalculatePrice = useCallback(
    (() => {
      let timeoutId: number;
      return async () => {
        if (!selectedProduct) return;
        
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          try {
            setLoading(true);
            const isRing = selectedProduct.name.toLowerCase().includes('ring');
            const response = await apiService.calculatePrice({
              productId: selectedProduct.id,
              metal: selectedMetal,
              stone: selectedStone,
              caratSize: selectedCaratSize,
              ringSize: isRing ? selectedRingSize : undefined,
              necklaceSize: !isRing ? selectedNecklaceSize : undefined,
            });
            setCalculatedPrice(response.finalPrice);
          } catch (error) {
            console.error('Error calculating price:', error);
            setCalculatedPrice(null);
          } finally {
            setLoading(false);
          }
        }, 300); // 300ms delay
      };
    })(),
    [selectedProduct, selectedMetal, selectedCaratSize]
  );

  // Calculate price when selections change (only price-affecting options)
  useEffect(() => {
    if (selectedProduct) {
      debouncedCalculatePrice();
    }
  }, [selectedProduct, selectedMetal, selectedCaratSize, debouncedCalculatePrice]);

  const handleAddToCart = () => {
    if (!selectedProduct || calculatedPrice === null) return;

    const isRing = selectedProduct.name.toLowerCase().includes('ring');
    const cartItem: CartItem = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      metal: selectedMetal,
      stone: "Diamond", // Always Diamond
      caratSize: selectedCaratSize,
      ringSize: isRing ? selectedRingSize : undefined,
      necklaceSize: !isRing ? selectedNecklaceSize : undefined,
      price: calculatedPrice,
    };

    onAddToCart(cartItem);
  };

  return (
    <div className="product-customizer">
                   <h2>Customize Your Jewelry</h2>
             <p>Pick metal and size — diamonds included in all pieces.</p>
      
      <div className="customizer-grid">
        {/* 3D Jewelry Viewer */}
        <div className="customizer-section">
          <h3>Preview Your Design</h3>
                           <JewelryViewer
                   key={`${selectedProduct?.name}-${selectedMetal}-${selectedCaratSize}-${selectedRingSize}-${selectedNecklaceSize}`}
                   productType={selectedProduct?.name.toLowerCase().includes('ring') ? 'ring' : 'necklace'}
                   metal={selectedMetal.toLowerCase() as 'silver' | 'gold' | 'rose gold'}
                   caratSize={selectedCaratSize}
                   ringSize={selectedRingSize}
                   necklaceSize={selectedNecklaceSize}
                 />
        </div>
        {/* Product Selection */}
        <div className="customizer-section">
          <h3>Choose Your Product</h3>
          <div className="product-options">
            {products.map((product) => (
              <button
                key={product.id}
                className={`product-option ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                onClick={() => setSelectedProduct(product)}
              >
                <h4>{product.name}</h4>
                <div className="price">Base Price: ${product.basePrice}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Customization Options */}
        {selectedProduct && (
          <>
            <div className="customizer-section">
              <h3>Select Metal</h3>
              <div className="customization-options">
                {METAL_OPTIONS.map((metal) => (
                  <button
                    key={metal}
                    className={`customization-option ${selectedMetal === metal ? 'selected' : ''}`}
                    onClick={() => setSelectedMetal(metal)}
                  >
                    {metal}
                  </button>
                ))}
              </div>
            </div>



            <div className="customizer-section">
              <h3>Select Carat Size</h3>
              <div className="customization-options">
                {CARAT_OPTIONS.map((caratSize) => (
                  <button
                    key={caratSize}
                    className={`customization-option ${selectedCaratSize === caratSize ? 'selected' : ''}`}
                    onClick={() => setSelectedCaratSize(caratSize)}
                  >
                    {caratSize}
                  </button>
                ))}
              </div>
            </div>

            {selectedProduct.name.toLowerCase().includes('ring') ? (
              <div className="customizer-section">
                <h3>Select Ring Size</h3>
                <div className="customization-options">
                  {RING_SIZE_OPTIONS.map((ringSize) => (
                    <button
                      key={ringSize}
                      className={`customization-option ${selectedRingSize === ringSize ? 'selected' : ''}`}
                      onClick={() => setSelectedRingSize(ringSize)}
                    >
                      {ringSize}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="customizer-section">
                <h3>Select Necklace Length</h3>
                <div className="customization-options">
                  {NECKLACE_SIZE_OPTIONS.map((necklaceSize) => (
                    <button
                      key={necklaceSize}
                      className={`customization-option ${selectedNecklaceSize === necklaceSize ? 'selected' : ''}`}
                      onClick={() => setSelectedNecklaceSize(necklaceSize)}
                    >
                      {necklaceSize}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Display */}
            <div className="price-display">
              {loading ? (
                <p>Calculating...</p>
              ) : calculatedPrice !== null ? (
                <>
                  <div className="final-price">${calculatedPrice.toFixed(2)}</div>
                  <div className="price-label">Final Price</div>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-gold"
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </button>
                  </div>
                </>
              ) : (
                <p>Select options to see price</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
