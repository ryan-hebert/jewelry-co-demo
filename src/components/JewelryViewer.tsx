import { useState } from 'react';

interface JewelryViewerProps {
  productType: 'ring' | 'necklace';
  metal: 'silver' | 'gold' | 'rose gold';
  caratSize: string;
  ringSize: string;
  necklaceSize: string;
}

export default function JewelryViewer({ productType, metal, caratSize, ringSize, necklaceSize }: JewelryViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map metal and product type selection to the appropriate asset
  const getJewelryAsset = (metal: string, productType: string) => {
    const metalKey = metal.toLowerCase();
    const productKey = productType.toLowerCase();
    
    switch (productKey) {
      case 'ring':
        switch (metalKey) {
          case 'silver':
            return '/src/assets/silver_ring.webp';
          case 'gold':
            return '/src/assets/gold_ring.webp';
          case 'rose gold':
            return '/src/assets/rose_gold_ring.webp';
          default:
            return '/src/assets/silver_ring.webp';
        }
      case 'necklace':
        switch (metalKey) {
          case 'silver':
            return '/src/assets/silver_necklace.webp';
          case 'gold':
            return '/src/assets/gold_necklace.webp';
          case 'rose gold':
            return '/src/assets/rose_gold_necklace.webp';
          default:
            return '/src/assets/silver_necklace.webp';
        }
      default:
        return '/src/assets/silver_ring.webp';
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError('Failed to load ring image');
  };



  return (
    <div className="jewelry-viewer">
      <div
        className="jewelry-viewer-container"
        style={{
          width: '100%',
          height: '400px',
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isLoading && (
          <div className="jewelry-viewer-loading" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2
          }}>
            <div className="loading-spinner"></div>
            <p>Loading ring preview...</p>
          </div>
        )}

        {error && (
          <div className="jewelry-viewer-error" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--surface)',
            color: 'var(--error)'
          }}>
            <p>{error}</p>
          </div>
        )}

        <img
          src={getJewelryAsset(metal, productType)}
          alt={`${metal} ${productType}`}
          style={{
            maxWidth: '80%',
            maxHeight: '80%',
            objectFit: 'contain',
            display: isLoading || error ? 'none' : 'block'
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>

      <div className="jewelry-viewer-controls">
        <p className="jewelry-viewer-hint">
          {metal} {productType} • Diamond ({caratSize}) • {productType === 'ring' ? `Size ${ringSize}` : `Length ${necklaceSize}`}
        </p>
      </div>
    </div>
  );
}
