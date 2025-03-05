import { Balance, EarnProduct, Transaction } from '@/types/earn';
import { DEFAULT_API_CONFIG, API_FEATURES } from '@/config/api';

export class EarnAPI {
  private baseUrl: string;
  private apiKey: string;
  private useMockData: boolean;
  private features: Record<string, boolean>;

  /**
   * Creates an instance of the Earn API client
   * @param baseUrl - Base URL for the API
   * @param apiKey - API key for authentication
   * @param useMockData - Whether to use mock data (for development/demo)
   * @param features - Feature flags for specific API modules
   */
  constructor(
    baseUrl: string = DEFAULT_API_CONFIG.baseUrl, 
    apiKey: string = DEFAULT_API_CONFIG.apiKey, 
    useMockData = DEFAULT_API_CONFIG.useMockData,
    features = API_FEATURES
  ) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.useMockData = useMockData;
    this.features = features;
    
    // Log API configuration in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      console.log('EarnAPI initialized with:', { 
        baseUrl, 
        useMockData, 
        features: { ...features },
        // Don't log API key for security
        hasApiKey: !!apiKey
      });
    }
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

    // Real API request
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('API request failed:', {
        status: response.status,
        statusText: response.statusText,
        endpoint,
        errorText
      });
      throw new Error(`API request failed: ${response.statusText} (${response.status})`);
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

  /**
   * Enables or disables mock data mode
   * @param useMock - Whether to use mock data
   */
  public setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
    console.log(`Mock data mode ${useMock ? 'enabled' : 'disabled'}`);
  }

  /**
   * Updates API configuration
   * @param config - New configuration
   */
  public updateConfig(config: Partial<{
    baseUrl: string;
    apiKey: string;
    useMockData: boolean;
    features: Partial<Record<string, boolean>>;
  }>): void {
    if (config.baseUrl) this.baseUrl = config.baseUrl;
    if (config.apiKey) this.apiKey = config.apiKey;
    if (config.useMockData !== undefined) this.useMockData = config.useMockData;
    if (config.features) {
      this.features = { ...this.features, ...config.features };
    }
    
    console.log('API configuration updated:', { 
      baseUrl: this.baseUrl, 
      useMockData: this.useMockData,
      features: { ...this.features },
      hasApiKey: !!this.apiKey
    });
  }

  /**
   * Checks if a specific feature is enabled
   * @param featureName - Feature to check
   * @returns Whether the feature is enabled
   */
  public isFeatureEnabled(featureName: string): boolean {
    return this.features[featureName] === true;
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

/**
 * Creates an EarnAPI instance with the specified configuration
 * @param baseUrl - Base URL for the API
 * @param apiKey - API key for authentication
 * @param useMockData - Whether to use mock data (for development/demo)
 * @returns EarnAPI instance
 */
export const createEarnAPI = (
  baseUrl: string = DEFAULT_API_CONFIG.baseUrl, 
  apiKey: string = DEFAULT_API_CONFIG.apiKey, 
  useMockData = DEFAULT_API_CONFIG.useMockData
): EarnAPI => {
  return new EarnAPI(baseUrl, apiKey, useMockData);
};

// Create a default instance that can be imported and used throughout the app
export const earnApi = createEarnAPI();
