
# Coinchange Earn Integration Guide

This guide explains how to integrate the Coinchange Earn platform into your application. We offer multiple integration options to suit different technical requirements.

## Option 1: React Component Integration

For React applications, you can use our components directly:

```tsx
// Import the EarnAPI hook
import { useEarnAPI } from '@coinchange/earn-sdk';

function EarnDashboard() {
  // Initialize the API with your partner ID
  const { 
    products, 
    balances, 
    deposit, 
    withdraw, 
    isLoading, 
    error 
  } = useEarnAPI('your-partner-id');

  // Handle deposit
  const handleDeposit = async (amount, currency) => {
    await deposit(amount, currency);
    // Update UI as needed
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Earn Products</h1>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.currency} - {product.apy}% APY</h2>
          <p>{product.description}</p>
          <button onClick={() => handleDeposit(100, product.currency)}>
            Earn Now
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Option 2: No-Code Embed Script

For non-technical integrations, simply add this script to your HTML:

```html
<script src="https://app.coinchange.io/widget.js" data-partner-id="your-partner-id"></script>
```

This will inject the Earn widget into your page at the script's location.

### Additional Configuration Options:

```html
<!-- Customize where the widget appears -->
<div id="earn-container"></div>
<script 
  src="https://app.coinchange.io/widget.js" 
  data-partner-id="your-partner-id"
  data-container-id="earn-container"
  data-theme="light"
  data-redirect="https://your-app.com/dashboard"
></script>
```

## Option 3: REST API Integration

For custom integrations, use our REST API directly:

```javascript
// Fetch partner configuration
const getPartnerConfig = async (partnerId) => {
  const response = await fetch(`https://api.coinchange.io/partner-config/${partnerId}`);
  return response.json();
};

// Fetch products
const getProducts = async (partnerId) => {
  const config = await getPartnerConfig(partnerId);
  const response = await fetch(`${config.baseUrl}/api/yaas/v1/products/`, {
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'X-Partner-ID': partnerId
    }
  });
  return response.json();
};

// Process a deposit
const deposit = async (partnerId, amount, currency) => {
  const config = await getPartnerConfig(partnerId);
  const response = await fetch(`${config.baseUrl}/api/yaas/v1/earn_clients/deposit/notify/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      'X-Partner-ID': partnerId
    },
    body: JSON.stringify({
      amount,
      currency
    })
  });
  return response.json();
};
```

## White-Labeling Options

### Custom Theme

You can customize colors by setting CSS variables:

```css
:root {
  --primary-color: #1E3A8A;
  --secondary-color: #059669;
  --accent-color: #6366F1;
  --background: #FFFFFF;
  --foreground: #0F172A;
}
```

### Partner-Specific Themes

For React integrations, you can apply partner-specific themes:

```tsx
// Apply theme class name based on partner ID
<div className={`app-container theme-${partnerId}`}>
  <EarnDashboard partnerId={partnerId} />
</div>
```

## Error Handling

All API requests include enhanced error logging to help with debugging:

```tsx
try {
  await deposit(100, 'USDC');
} catch (error) {
  console.error('Deposit failed:', error);
  // Show user-friendly error message
}
```

## Testing

You can use mock data for testing by setting `useMockData` to `true`:

```tsx
const { products } = useEarnAPI('your-partner-id', { useMockData: true });
```

## Need Help?

Contact our integration team at [integration@coinchange.io](mailto:integration@coinchange.io) for assistance.
