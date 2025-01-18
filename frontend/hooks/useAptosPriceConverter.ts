import { useAptosPrice } from './useAptosPrice';

export const useAptosPriceConverter = () => {
  const { price, loading, error } = useAptosPrice();

  const aptosToUsd = (aptosAmount: number): number | null => {
    if (!price || loading || error) return null;
    return aptosAmount * price;
  };

  const usdToAptos = (usdAmount: number): number | null => {
    if (!price || loading || error) return null;
    return usdAmount / price;
  };

  return {
    aptosToUsd,
    usdToAptos,
    loading,
    error
  };
};