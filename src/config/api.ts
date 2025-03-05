
/**
 * API Configuration
 * This file centralizes API connection settings for the application
 */

// Default API configuration with environment variable support
export const DEFAULT_API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api-sandbox.coinchange.io',
  apiKey: import.meta.env.VITE_API_KEY || '',
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'false' ? false : true, // Default to mock data unless explicitly set to false
};

// API feature flags
export const API_FEATURES = {
  earnings: import.meta.env.VITE_FEATURE_EARNINGS === 'false' ? false : true,
  transactions: import.meta.env.VITE_FEATURE_TRANSACTIONS === 'false' ? false : true,
  // Add other module flags as needed
};

// Export type for environment variable reference
export type ApiEnvVariables = {
  VITE_API_BASE_URL: string;
  VITE_API_KEY: string;
  VITE_USE_MOCK_DATA: string;
  VITE_FEATURE_EARNINGS: string;
  VITE_FEATURE_TRANSACTIONS: string;
};
