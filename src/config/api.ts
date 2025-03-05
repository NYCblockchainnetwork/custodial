
/**
 * API Configuration
 * This file centralizes API connection settings for the application
 */

// Default API configuration
export const DEFAULT_API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api-sandbox.coinchange.io',
  apiKey: import.meta.env.VITE_API_KEY || '',
  useMockData: true, // Default to mock data for development/demo
};

// API feature flags
export const API_FEATURES = {
  earnings: true, // Enable/disable earnings module API integration
  transactions: true, // Enable/disable transactions module API integration
  // Add other module flags as needed
};
