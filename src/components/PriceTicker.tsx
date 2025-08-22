import { useEffect, useState } from "react";

type Prices = {
  gold: number | null;
  silver: number | null;
  platinum: number | null;
};

type MetalsDevResponse = {
  status: string;
  currency: string;
  unit: string;
  metals: {
    gold: number;
    silver: number;
    platinum: number;
  };
  currencies: Record<string, number>;
  timestamp: string;
};

type CachedPrices = {
  prices: Prices;
  timestamp: number;
};

const CACHE_KEY = 'metals_prices_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function PriceTicker() {
  const [prices, setPrices] = useState<Prices>({ gold: null, silver: null, platinum: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cached prices from localStorage
  const loadCachedPrices = (): CachedPrices | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: CachedPrices = JSON.parse(cached);
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to load cached prices:', err);
    }
    return null;
  };

  // Save prices to localStorage with timestamp
  const saveCachedPrices = (prices: Prices) => {
    try {
      const cacheData: CachedPrices = {
        prices,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (err) {
      console.warn('Failed to save cached prices:', err);
    }
  };

  // Check if cache is still valid (less than 24 hours old)
  const isCacheValid = (timestamp: number): boolean => {
    return Date.now() - timestamp < CACHE_DURATION;
  };

  useEffect(() => {
    async function fetchPrices() {
      try {
        setLoading(true);
        setError(null);

        // First, try to load from cache
        const cached = loadCachedPrices();
        
        if (cached && isCacheValid(cached.timestamp)) {
          // Use cached data if it's still valid
          setPrices(cached.prices);
          setLoading(false);
          return;
        }

        // If no valid cache, fetch from API
        const apiKey = import.meta.env.VITE_METALSDEV_API_KEY || '';
        const response = await fetch(`https://api.metals.dev/v1/latest?api_key=${apiKey}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data: MetalsDevResponse = await response.json();
        
        if (data.status !== 'success') {
          throw new Error("API returned unsuccessful status");
        }

        const newPrices = {
          gold: data.metals.gold || null,
          silver: data.metals.silver || null,
          platinum: data.metals.platinum || null,
        };

        // Save to cache
        saveCachedPrices(newPrices);
        
        setPrices(newPrices);
      } catch (err) {
        console.error("Error fetching prices:", err);
        
        // If API fails, try to use cached data even if expired
        const cached = loadCachedPrices();
        if (cached) {
          setPrices(cached.prices);
          setError("Using cached prices - live update unavailable");
        } else {
          const errorMessage = err instanceof Error && err.message.includes("API request failed") 
            ? "Live prices temporarily unavailable" 
            : "Unable to load prices";
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
    
    // Set up interval to check for cache expiration (check every hour)
    const interval = setInterval(() => {
      const cached = loadCachedPrices();
      if (!cached || !isCacheValid(cached.timestamp)) {
        fetchPrices();
      }
    }, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(interval);
  }, []);

  if (loading && !prices.gold && !prices.silver && !prices.platinum) {
    return (
      <div className="price-ticker">
        <div className="price-ticker-content">
          <span className="price-ticker-item">Loading live prices...</span>
        </div>
      </div>
    );
  }

  if (error && !prices.gold && !prices.silver && !prices.platinum) {
    return (
      <div className="price-ticker">
        <div className="price-ticker-content">
          <span className="price-ticker-item">
            <span className="price-ticker-label">Gold:</span>
            <span className="price-ticker-value">$2,450.00</span>
          </span>
          <span className="price-ticker-item">
            <span className="price-ticker-label">Silver:</span>
            <span className="price-ticker-value">$28.50</span>
          </span>
          <span className="price-ticker-item">
            <span className="price-ticker-label">Platinum:</span>
            <span className="price-ticker-value">$1,025.00</span>
          </span>
          <span className="price-ticker-update price-ticker-error">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="price-ticker">
      <div className="price-ticker-content">
                            {prices.gold && (
                      <span className="price-ticker-item">
                        <span className="price-ticker-label">Gold:</span>
                        <span className="price-ticker-value">${prices.gold.toFixed(2)}</span>
                      </span>
                    )}
                    {prices.silver && (
                      <span className="price-ticker-item">
                        <span className="price-ticker-label">Silver:</span>
                        <span className="price-ticker-value">${prices.silver.toFixed(2)}</span>
                      </span>
                    )}
                    {prices.platinum && (
                      <span className="price-ticker-item">
                        <span className="price-ticker-label">Platinum:</span>
                        <span className="price-ticker-value">${prices.platinum.toFixed(2)}</span>
                      </span>
                    )}
        <span className="price-ticker-update">
          {error && error.includes("cached") ? "Cached prices • Updates daily" : "Live prices • Updates daily"}
        </span>
      </div>
    </div>
  );
}
