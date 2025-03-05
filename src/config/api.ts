
/**
 * API Configuration
 * This file centralizes API connection settings for the application
 */

// Partner configuration support
export interface PartnerConfig {
  partnerId: string;
  apiKey: string;
  baseUrl: string;
  features: Record<string, boolean>;
  theme?: Record<string, string>;
}

// Default API configuration with environment variable support
export const DEFAULT_API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api-sandbox.coinchange.io',
  apiKey: import.meta.env.VITE_API_KEY || '',
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'false' ? false : true, // Default to mock data unless explicitly set to false
  partnerId: import.meta.env.VITE_PARTNER_ID || 'default',
};

// API feature flags
export const API_FEATURES = {
  earnings: import.meta.env.VITE_FEATURE_EARNINGS === 'false' ? false : true,
  transactions: import.meta.env.VITE_FEATURE_TRANSACTIONS === 'false' ? false : true,
  // Add other module flags as needed
};

// Sample partner configurations (in production, this would come from an API)
export const PARTNER_CONFIGS: Record<string, PartnerConfig> = {
  'partner-123': {
    partnerId: 'partner-123',
    apiKey: 'sample-key-123',
    baseUrl: 'https://api-sandbox.coinchange.io',
    features: {
      earnings: true,
      transactions: true
    },
    theme: {
      primaryColor: '#1E3A8A',
      secondaryColor: '#059669'
    }
  },
  'partner-456': {
    partnerId: 'partner-456',
    apiKey: 'sample-key-456',
    baseUrl: 'https://api-sandbox.coinchange.io',
    features: {
      earnings: true,
      transactions: false
    },
    theme: {
      primaryColor: '#7C3AED',
      secondaryColor: '#10B981'
    }
  }
};

/**
 * Fetches partner configuration from API or returns from local cache
 * @param partnerId - The ID of the partner
 * @returns Partner configuration object
 */
export const getPartnerConfig = async (partnerId: string): Promise<PartnerConfig> => {
  // In a real implementation, this would make an API call to fetch the partner config
  // For demonstration, we're using the local PARTNER_CONFIGS
  
  if (DEFAULT_API_CONFIG.useMockData) {
    // For demo/development, use the local configs
    return PARTNER_CONFIGS[partnerId] || {
      partnerId,
      apiKey: DEFAULT_API_CONFIG.apiKey,
      baseUrl: DEFAULT_API_CONFIG.baseUrl,
      features: API_FEATURES
    };
  }
  
  try {
    // This would be an actual API call in production
    const response = await fetch(`${DEFAULT_API_CONFIG.baseUrl}/partner-config/${partnerId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch partner config: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching partner config:', error);
    // Fallback to defaults if API call fails
    return {
      partnerId,
      apiKey: DEFAULT_API_CONFIG.apiKey,
      baseUrl: DEFAULT_API_CONFIG.baseUrl,
      features: API_FEATURES
    };
  }
};

// Export type for environment variable reference
export type ApiEnvVariables = {
  VITE_API_BASE_URL: string;
  VITE_API_KEY: string;
  VITE_USE_MOCK_DATA: string;
  VITE_FEATURE_EARNINGS: string;
  VITE_FEATURE_TRANSACTIONS: string;
  VITE_PARTNER_ID: string;
};
