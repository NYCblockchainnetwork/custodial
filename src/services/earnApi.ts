import { EarnProduct, Balance, Transaction, EarnStats } from '../types/earn';

/**
 * EarnAPI Service
 * Handles all interactions with the Coinchange YaaS API
 */
class EarnAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetches available earn products and their current APY rates
   */
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

export const createEarnAPI = (baseUrl: string, apiKey: string) => new EarnAPI(baseUrl, apiKey);