import { useState, useEffect } from 'react';
import { Account } from '@aptos-labs/wallet-adapter-react';
import { useAptosPrice } from './useAptosPrice';

export const useUsdAptos = (account?: Account) => {
  const { aptPrice, convertAptToUsd } = useAptosPrice();

  /**
   * Converts APT balance to USD
   * @param aptBalance Balance in APT
   * @returns USD equivalent
   */
  const convertAptBalanceToUsd = (aptBalance: number): number | null => {
    if (aptPrice === null) return null;
    return Number((aptBalance * aptPrice).toFixed(2));
  };

  /**
   * Converts USD to APT
   * @param usdAmount Amount in USD
   * @returns APT equivalent
   */
  const convertUsdToApt = (usdAmount: number): number | null => {
    if (aptPrice === null) return null;
    return Number((usdAmount / aptPrice).toFixed(6));
  };

  return {
    convertAptBalanceToUsd,
    convertUsdToApt
  };
};