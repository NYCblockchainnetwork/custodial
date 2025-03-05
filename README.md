
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

## Integration Guide

### API Configuration

The platform is designed to connect to a Yield-as-a-Service API. For development and demonstration purposes, it includes mock data support that can be toggled on/off.

1. Configure your API connection in `src/config/api.ts`
2. Set environment variables:
   - `VITE_API_BASE_URL`: Your API base URL
   - `VITE_API_KEY`: Your API key

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
```

#### 2. Transaction Module

The `TransactionForm` component handles deposits and withdrawals:

```jsx
import { TransactionForm } from '@/components/earn/TransactionForm';

// Deposit form
<TransactionForm
  type="deposit"
  currency="USDC"
  maxAmount={1000}
  onSubmit={handleDeposit}
/>

// Withdrawal form
<TransactionForm
  type="withdrawal"
  currency="USDC"
  maxAmount={availableBalance}
  onSubmit={handleWithdraw}
/>
```

#### 3. Transaction History Module

The `TransactionHistory` component displays transaction records:

```jsx
import { TransactionHistory } from '@/components/earn/TransactionHistory';

<TransactionHistory transactions={transactions} />
```

#### 4. API Configuration Panel

The `ApiConfigPanel` component provides a UI for toggling between mock data and live API:

```jsx
import { ApiConfigPanel } from '@/components/earn/ApiConfigPanel';

<ApiConfigPanel 
  onConfigChange={(config) => {
    console.log('API config changed:', config);
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
```

## Design Customization

The platform supports multiple design variants through the `variant` prop on components:

- `default`: Standard design
- `dark`: Dark theme
- `bright`: Bright orange accents
- `pastel`: Soft green accents
- `monochrome`: Grayscale design
- `minimal`: Minimalist design
- `glass`: Glassmorphism effect
- `gradient`: Gradient backgrounds
- `modern`: Modern clean design
- `futuristic`: Futuristic purple accents
- `neo-brutalism`: Bold neo-brutalist design

```jsx
<OffersList variant="dark" />
<TransactionForm variant="minimal" />
```

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

### Adding New Products

To add new earning products, modify the mock data in `src/services/earnApi.ts` or connect to your API.

### White Labeling

To white label the platform:

1. Customize the theme in `tailwind.config.ts`
2. Update component variants in `src/lib/layoutVariants.ts`
3. Replace logos and branding elements

## Deployment

This project can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the generated `dist` directory

For Netlify, Vercel, or other CI/CD services, point to your repository and use the build command `npm run build`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
