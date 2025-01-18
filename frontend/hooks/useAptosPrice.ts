import { useState, useEffect } from 'react';

// Fetch Aptos price from CoinGecko API
const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=aptos&vs_currencies=usd';

export const useAptosPrice = () => {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(COINGECKO_API);
        const data = await response.json();
        setPrice(data.aptos.usd);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Aptos price');
        setLoading(false);
      }
    };

    fetchPrice();
    // Refresh price every 60 seconds
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  return { price, loading, error };
};