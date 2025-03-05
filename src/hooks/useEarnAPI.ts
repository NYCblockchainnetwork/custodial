import { useState, useEffect } from 'react';
import { DEFAULT_API_CONFIG, getPartnerConfig, PartnerConfig, API_FEATURES } from '../config/api';

interface EarnProduct {
  id: string;
  currency: string;
  apy: number;
  description: string;
}

interface Balance {
  currency: string;
  amount: number;
}

interface EarnAPI {
  products: EarnProduct[];
  balances: Balance[];
  deposit: (amount: number, currency: string) => Promise<any>;
  withdraw: (amount: number, currency: string) => Promise<any>;
  isLoading: boolean;
  error: Error | null;
}

interface EarnAPIOptions {
  useMockData?: boolean;
  apiKey?: string;
  baseUrl?: string;
}

export function useEarnAPI(partnerId = DEFAULT_API_CONFIG.partnerId, options: EarnAPIOptions = {}): EarnAPI {
  const {
    useMockData = DEFAULT_API_CONFIG.useMockData,
    apiKey = DEFAULT_API_CONFIG.apiKey,
    baseUrl = DEFAULT_API_CONFIG.baseUrl,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [products, setProducts] = useState<EarnProduct[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [partnerConfig, setPartnerConfig] = useState<PartnerConfig | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const config = await getPartnerConfig(partnerId);
        setPartnerConfig(config);

        if (useMockData) {
          // Mock data for development/testing
          setProducts([
            { id: 'btc-product', currency: 'BTC', apy: 4.5, description: 'Earn on your Bitcoin' },
            { id: 'eth-product', currency: 'ETH', apy: 6.0, description: 'Earn on your Ethereum' },
          ]);
          setBalances([
            { currency: 'BTC', amount: 0.5 },
            { currency: 'ETH', amount: 2.0 },
          ]);
        } else {
          // Fetch data from the actual API
          const productsResponse = await fetch(`${baseUrl}/api/yaas/v1/products/`, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'X-Partner-ID': partnerId
            }
          });
          if (!productsResponse.ok) {
            throw new Error(`Failed to fetch products: ${productsResponse.statusText}`);
          }
          setProducts(await productsResponse.json());

          const balancesResponse = await fetch(`${baseUrl}/api/yaas/v1/earn_clients/balances/`, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'X-Partner-ID': partnerId
            }
          });
          if (!balancesResponse.ok) {
            throw new Error(`Failed to fetch balances: ${balancesResponse.statusText}`);
          }
          setBalances(await balancesResponse.json());
        }
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [partnerId, useMockData, apiKey, baseUrl]);

  const deposit = async (amount: number, currency: string): Promise<any> => {
    if (!partnerConfig) {
      setError(new Error('Partner configuration not loaded.'));
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/yaas/v1/earn_clients/deposit/notify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-Partner-ID': partnerId
        },
        body: JSON.stringify({
          amount,
          currency
        })
      });

      if (!response.ok) {
        throw new Error(`Deposit failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  const withdraw = async (amount: number, currency: string): Promise<any> => {
    if (!partnerConfig) {
      setError(new Error('Partner configuration not loaded.'));
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/yaas/v1/earn_clients/withdraw/notify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-Partner-ID': partnerId
        },
        body: JSON.stringify({
          amount,
          currency
        })
      });

      if (!response.ok) {
        throw new Error(`Withdrawal failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };
  
  // Ensure we're passing an object with the correct properties when using API_FEATURES
  const getFeatures = () => {
    return {
      earnings: API_FEATURES.earnings ?? true,
      transactions: API_FEATURES.transactions ?? true
    };
  };

  return {
    products,
    balances,
    deposit,
    withdraw,
    isLoading,
    error
  };
}
