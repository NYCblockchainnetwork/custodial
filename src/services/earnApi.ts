import { Balance, EarnProduct, Transaction } from '@/types/earn';

export class EarnAPI {
  private baseUrl: string;
  private apiKey: string;
  private useMockData: boolean;

  constructor(baseUrl: string, apiKey: string, useMockData = true) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.useMockData = useMockData;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // For development/demo purposes, return mock data if enabled
    if (this.useMockData) {
      if (endpoint.includes('transactions')) {
        return this.getMockTransactions() as T;
      }
      if (endpoint.includes('balances')) {
        return this.getMockBalances() as T;
      }
      if (endpoint.includes('products')) {
        return this.getMockProducts() as T;
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  private getMockTransactions(): Transaction[] {
    return [
      {
        id: '1',
        type: 'deposit',
        amount: 1000,
        currency: 'USDC',
        status: 'completed',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      },
      {
        id: '2',
        type: 'earning',
        amount: 5.25,
        currency: 'USDC',
        status: 'completed',
        timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      },
      {
        id: '3',
        type: 'withdrawal',
        amount: 200,
        currency: 'USDC',
        status: 'pending',
        timestamp: new Date().toISOString(), // Now
      },
    ];
  }

  private getMockBalances(): Balance[] {
    return [
      {
        currency: 'USDC',
        total: 2500,
        available: 2300,
        earning: 200,
      }
    ];
  }

  private getMockProducts(): EarnProduct[] {
    return [
      {
        id: '1',
        name: 'USDC Earn',
        currency: 'USDC',
        apy: 8.5,
        minDeposit: 100,
        maxDeposit: 100000,
        description: 'Earn yield on your USDC holdings',
        riskLevel: 'Low',
      }
    ];
  }

  public setUseMockData(useMock: boolean) {
    this.useMockData = useMock;
  }

  async getProducts(): Promise<EarnProduct[]> {
    return this.request<EarnProduct[]>('/api/yaas/v1/products/');
  }

  /**
   * Initiates a deposit to the earn account
   */
  async deposit(amount: number, currency: string): Promise<Transaction> {
    return this.request<Transaction>('/api/yaas/v1/earn_clients/deposit/notify/', {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    });
  }

  /**
   * Initiates a withdrawal from the earn account
   */
  async withdraw(amount: number, currency: string): Promise<Transaction> {
    return this.request<Transaction>('/api/yaas/v1/earn_clients/transactions/withdraw/', {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    });
  }

  /**
   * Fetches current balances and earnings
   */
  async getBalances(): Promise<Balance[]> {
    return this.request<Balance[]>('/api/yaas/v1/earn_clients/balances/');
  }

  /**
   * Fetches transaction history
   */
  async getTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>('/api/yaas/v1/earn_clients/transactions/');
  }
}

export const createEarnAPI = (baseUrl: string, apiKey: string, useMockData = true) => {
  return new EarnAPI(baseUrl, apiKey, useMockData);
};
