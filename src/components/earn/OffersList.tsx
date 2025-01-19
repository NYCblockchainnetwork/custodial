import { useQuery } from '@tanstack/react-query';
import { createEarnAPI } from '@/services/earnApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bitcoin, CircleDollarSign, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionForm } from './TransactionForm';

// Initialize API with configuration
const earnApi = createEarnAPI(
  import.meta.env.VITE_API_BASE_URL || 'https://api-sandbox.coinchange.io',
  import.meta.env.VITE_API_KEY || ''
);

const getCryptoIcon = (currency: string) => {
  switch (currency.toUpperCase()) {
    case 'BTC':
      return <Bitcoin className="w-8 h-8" />;
    case 'ETH':
      return <Coins className="w-8 h-8" />;
    default:
      return <CircleDollarSign className="w-8 h-8" />;
  }
};

const getCryptoName = (currency: string) => {
  const names: Record<string, string> = {
    'USDC': 'USD Coin',
    'USDT': 'Tether',
    'DAI': 'Dai',
    'ETH': 'Ethereum',
    'BTC': 'Bitcoin'
  };
  return names[currency] || currency;
};

// Sample product for demonstration - can be commented out when not needed
const sampleProduct = {
  id: 'sample-usdc',
  currency: 'USDC',
  apy: 9.5,
};

export const OffersList = () => {
  const { data: products = [] } = useQuery({
    queryKey: ['earnProducts'],
    queryFn: () => earnApi.getProducts(),
  });

  // Uncomment the next line to include the sample USDC product
  const allProducts = [...products, sampleProduct];
  // Comment out the above line and uncomment the next line to remove sample product
  // const allProducts = products;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Earn Account earnings performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {allProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-4 border-b last:border-b-0"
          >
            <div className="flex items-center gap-3">
              {getCryptoIcon(product.currency)}
              <div>
                <div className="font-medium">
                  {getCryptoName(product.currency)}
                </div>
                <div className="text-sm text-gray-500">
                  {product.currency}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-lg font-semibold">
                {product.apy.toFixed(1)}% APY
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm">
                    Earn
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {getCryptoIcon(product.currency)}
                      {getCryptoName(product.currency)}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <TransactionForm
                      type="deposit"
                      currency={product.currency}
                      maxAmount={520.023}
                      onSubmit={async (amount) => {
                        // Handle deposit
                        console.log('Deposit:', amount);
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
        <p className="text-sm text-gray-500 text-center mt-4">
          APY based on previous 14-day performance
        </p>
      </CardContent>
    </Card>
  );
};