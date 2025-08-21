import { useEffect, useState } from "react";

type Prices = {
  gold: number | null;
  silver: number | null;
  platinum: number | null;
};

export function PriceTicker() {
  const [prices, setPrices] = useState<Prices>({ gold: null, silver: null, platinum: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrices() {
      try {
        setLoading(true);
        setError(null);
        
        const [goldRes, silverRes, platinumRes] = await Promise.all([
          fetch("https://www.goldapi.io/api/XAU/USD", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': import.meta.env.VITE_GOLDAPI_TOKEN || '',
            },
          }),
          fetch("https://www.goldapi.io/api/XAG/USD", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': import.meta.env.VITE_GOLDAPI_TOKEN || '',
            },
          }),
          fetch("https://www.goldapi.io/api/XPT/USD", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': import.meta.env.VITE_GOLDAPI_TOKEN || '',
            },
          }),
        ]);

        // Check if responses are ok, but don't throw immediately
        let goldData = null;
        let silverData = null;
        let platinumData = null;

        if (goldRes.ok) {
          goldData = await goldRes.json();
        }
        if (silverRes.ok) {
          silverData = await silverRes.json();
        }
        if (platinumRes.ok) {
          platinumData = await platinumRes.json();
        }

        // If all failed, show error
        if (!goldData && !silverData && !platinumData) {
          throw new Error("API limit reached - prices unavailable");
        }

        setPrices({
          gold: goldData?.price || null,
          silver: silverData?.price || null,
          platinum: platinumData?.price || null,
        });
              } catch (err) {
          console.error("Error fetching prices:", err);
          const errorMessage = err instanceof Error && err.message.includes("API limit") 
            ? "Live prices temporarily unavailable" 
            : "Unable to load prices";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 86400000); // refresh every 24 hours (1 day)
    
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
        <span className="price-ticker-update">Live prices • Updates daily</span>
      </div>
    </div>
  );
}
