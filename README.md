
# Cryptocurrency Earn Platform

A white-label cryptocurrency earning platform that allows partners to integrate yield-generating products for their users. The platform connects to a Yield-as-a-Service (YaaS) API and provides modular components for easy integration.

## Project Overview

This project provides a complete UI for cryptocurrency earning products, including:

- Product listings with APY rates
- Deposit and withdrawal functionality
- Transaction history
- Account balances
- API integration with mock data support

## Quick Start

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Clone the repository
git clone [YOUR_REPOSITORY_URL]

# Navigate to the project directory
cd [PROJECT_NAME]

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Environment Variables

Configure the following environment variables for your deployment:

```
# API Configuration
VITE_API_BASE_URL=https://api.example.com
VITE_API_KEY=your-api-key
VITE_USE_MOCK_DATA=true

# Feature Flags
VITE_FEATURE_EARNINGS=true
VITE_FEATURE_TRANSACTIONS=true
```

## White-Label Integration Guide

The platform is designed for easy customization and modular integration into existing applications.

### Customizing Theme

1. **CSS Variables**: Update CSS variables in `src/index.css` to match your brand colors:

```css
:root {
  --primary-color: #YOUR_BRAND_COLOR;
  --secondary-color: #YOUR_SECONDARY_COLOR;
  /* Other variables... */
}
```

2. **Custom Theme Class**: Apply theme classes to containers:

```jsx
<div className="theme-dark">
  <OffersList />
</div>
```

### Module Integration

The platform is built with modular components that can be used independently:

#### 1. Offers List Module

The `OffersList` component displays available earning products with their APY rates:

```jsx
import { OffersList } from '@/components/earn/OffersList';

// Basic usage
<OffersList />

// With custom styling variant
<OffersList variant="dark" />

// With custom container styling
<OffersList containerClassName="ml-0 w-full" className="bg-white" />
```

Available variants: `default`, `dark`, `bright`, `pastel`, `monochrome`, `minimal`, `glass`, `gradient`, `modern`, `futuristic`, `neo-brutalism`

#### 2. Individual Product Item

For even more granular control, use the `EarnProductItem` component:

```jsx
import { EarnProductItem } from '@/components/earn/EarnProductItem';

<EarnProductItem
  product={product}
  variant="default"
  onEarnClick={(product) => openDepositModal(product)}
  className="my-custom-class"
/>
```

#### 3. Product Card

For a card-based layout of individual products:

```jsx
import { ProductCard } from '@/components/earn/ProductCard';

<ProductCard
  product={product}
  onInvest={handleInvest}
  variant="default"
  className="my-custom-class"
/>

// Use in a responsive grid
<div className="earn-products-grid">
  {products.map(product => (
    <ProductCard key={product.id} product={product} onInvest={handleInvest} />
  ))}
</div>
```

#### 4. Transaction Module

The `TransactionForm` component handles deposits and withdrawals:

```jsx
import { TransactionForm } from '@/components/earn/TransactionForm';

// Deposit form
<TransactionForm
  type="deposit"
  currency="USDC"
  maxAmount={1000}
  onSubmit={handleDeposit}
  variant="default"
/>

// Withdrawal form
<TransactionForm
  type="withdrawal"
  currency="USDC"
  maxAmount={availableBalance}
  onSubmit={handleWithdraw}
/>
```

#### 5. Transaction History Module

The `TransactionHistory` component displays transaction records:

```jsx
import { TransactionHistory } from '@/components/earn/TransactionHistory';

<TransactionHistory transactions={transactions} />
```

#### 6. API Configuration Panel

The `ApiConfigPanel` component provides a UI for toggling between mock data and live API:

```jsx
import { ApiConfigPanel } from '@/components/earn/ApiConfigPanel';

<ApiConfigPanel 
  onConfigChange={(config) => {
    console.log('API config changed:', config);
    // Refetch data with new configuration
  }} 
/>
```

### API Service

The `earnApi` service handles all API communication:

```typescript
import { earnApi } from '@/services/earnApi';

// Get products
const products = await earnApi.getProducts();

// Deposit funds
await earnApi.deposit(amount, currency);

// Withdraw funds
await earnApi.withdraw(amount, currency);

// Get balances
const balances = await earnApi.getBalances();

// Get transaction history
const transactions = await earnApi.getTransactions();

// Toggle mock data (for demos/testing)
earnApi.setUseMockData(true);

// Update API configuration programmatically
earnApi.updateConfig({
  baseUrl: 'https://new-api-url.com',
  apiKey: 'new-api-key',
  useMockData: false,
  features: { earnings: true, transactions: false }
});
```

## Custom Layout Examples

### Basic Integration

```jsx
import { OffersList } from '@/components/earn/OffersList';

function MyEarnSection() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Earn with Crypto</h1>
      <OffersList />
    </div>
  );
}
```

### Advanced Integration with Custom Styling

```jsx
import { useQuery } from '@tanstack/react-query';
import { earnApi } from '@/services/earnApi';
import { ProductCard } from '@/components/earn/ProductCard';

function CustomEarnDashboard() {
  const { data: products = [] } = useQuery({
    queryKey: ['earnProducts'],
    queryFn: () => earnApi.getProducts(),
  });

  return (
    <div className="bg-gray-50 p-8 rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Grow Your Crypto</h1>
      <p className="mb-6 text-gray-600">Choose from our selection of earning products:</p>
      
      <div className="earn-products-grid">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            variant="modern"
            onInvest={(product) => console.log('Selected:', product)}
          />
        ))}
      </div>
    </div>
  );
}
```

### Full Dashboard Integration

```jsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OffersList } from '@/components/earn/OffersList';
import { TransactionHistory } from '@/components/earn/TransactionHistory';
import { TransactionForm } from '@/components/earn/TransactionForm';
import { earnApi } from '@/services/earnApi';
import { useQuery } from '@tanstack/react-query';

function EarnDashboard() {
  const { data: transactions = [] } = useQuery({
    queryKey: ['earnTransactions'],
    queryFn: () => earnApi.getTransactions(),
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Earn Dashboard</h1>
      
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="transactions">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <OffersList variant="modern" />
        </TabsContent>
        
        <TabsContent value="deposit">
          <TransactionForm 
            type="deposit" 
            currency="USDC" 
            maxAmount={1000} 
            onSubmit={(amount, currency) => {
              earnApi.deposit(amount, currency);
            }}
          />
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionHistory transactions={transactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## Deployment

This project can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the generated `dist` directory

For Netlify, Vercel, or other CI/CD services, point to your repository and use the build command `npm run build`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
