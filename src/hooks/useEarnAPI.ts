
import { useState } from 'react';
import { EarnAPI } from '@/services/earnApi';
import { getPartnerConfig, DEFAULT_API_CONFIG } from '@/config/api';
import { useQuery } from '@tanstack/react-query';
import { Balance, EarnProduct, Transaction } from '@/types/earn';

/**
 * Custom hook for easy integration with the Earn API
 * Partners can use this hook to easily access all Earn functionality
 * 
 * @param partnerId - Optional partner ID (defaults to env variable)
 * @returns Object with API methods and data
 */
export const useEarnAPI = (partnerId: string = DEFAULT_API_CONFIG.partnerId) => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch partner config
  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ['partnerConfig', partnerId],
    queryFn: () => getPartnerConfig(partnerId),
  });

  // Initialize API instance
  const api = new EarnAPI(
    config?.baseUrl || DEFAULT_API_CONFIG.baseUrl,
    config?.apiKey || DEFAULT_API_CONFIG.apiKey,
    DEFAULT_API_CONFIG.useMockData,
    config?.features
  );

  // Enhanced API request with better error handling
  const enhancedRequest = async <T>(
    apiMethod: () => Promise<T>,
    errorMessage: string
  ): Promise<T | null> => {
    setError(null);
    setIsLoading(true);
    
    try {
      const result = await apiMethod();
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(errorMessage);
      console.error(`Earn API Error: ${errorObj.message}`, err);
      setError(errorObj);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Products data query
  const productsQuery = useQuery({
    queryKey: ['earnProducts', partnerId],
    queryFn: () => api.getProducts(),
    enabled: !configLoading,
  });

  // Balances data query
  const balancesQuery = useQuery({
    queryKey: ['earnBalances', partnerId],
    queryFn: () => api.getBalances(),
    enabled: !configLoading,
  });

  // Transactions data query
  const transactionsQuery = useQuery({
    queryKey: ['earnTransactions', partnerId],
    queryFn: () => api.getTransactions(),
    enabled: !configLoading,
  });

  // API methods
  return {
    // Data
    products: productsQuery.data || [],
    balances: balancesQuery.data || [],
    transactions: transactionsQuery.data || [],
    config,
    
    // Status
    isLoading: isLoading || configLoading || productsQuery.isLoading || balancesQuery.isLoading,
    error,
    
    // API methods
    deposit: (amount: number, currency: string) => 
      enhancedRequest(() => api.deposit(amount, currency), "Deposit failed"),
      
    withdraw: (amount: number, currency: string) => 
      enhancedRequest(() => api.withdraw(amount, currency), "Withdrawal failed"),
      
    getBalances: () => 
      enhancedRequest(() => api.getBalances(), "Failed to fetch balances"),
      
    getTransactions: () => 
      enhancedRequest(() => api.getTransactions(), "Failed to fetch transactions"),
      
    getProducts: () => 
      enhancedRequest(() => api.getProducts(), "Failed to fetch products"),
      
    // Refetch data
    refetch: () => {
      productsQuery.refetch();
      balancesQuery.refetch();
      transactionsQuery.refetch();
    }
  };
};

/**
 * Example usage:
 * 
 * const { 
 *   products, 
 *   balances, 
 *   deposit, 
 *   withdraw, 
 *   isLoading, 
 *   error 
 * } = useEarnAPI('partner-123');
 * 
 * // Deposit funds
 * const handleDeposit = async () => {
 *   await deposit(100, 'USDC');
 * };
 */
