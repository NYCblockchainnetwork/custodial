import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bitcoin, CircleDollarSign, Coins, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionForm } from './TransactionForm';
import { offerLayouts, LayoutVariant } from '@/lib/layoutVariants';

// Sample products for demonstration
const sampleProducts = [
  {
    id: 'sample-usdc',
    currency: 'USDC',
    apy: 9.5,
  },
  {
    id: 'sample-usdt',
    currency: 'USDT',
    apy: 8.75,
  },
  {
    id: 'sample-eth',
    currency: 'ETH',
    apy: 5.2,
  },
  {
    id: 'sample-btc',
    currency: 'BTC',
    apy: 4.8,
  },
  {
    id: 'sample-dai',
    currency: 'DAI',
    apy: 8.9,
  }
];

const getCryptoIcon = (currency: string) => {
  switch (currency.toUpperCase()) {
    case 'BTC':
      return <Bitcoin className="w-8 h-8" />;
    case 'ETH':
      return <Coins className="w-8 h-8" />;
    case 'USDC':
    case 'USDT':
    case 'DAI':
      return <DollarSign className="w-8 h-8" />;
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

interface OffersListProps {
  variant?: LayoutVariant;
}

export const OffersList = ({ variant = 'default' }: OffersListProps) => {
  // Using sample data instead of API call
  const { data: products = sampleProducts } = useQuery({
    queryKey: ['earnProducts'],
    queryFn: () => Promise.resolve(sampleProducts),
  });

  const getItemStyles = () => {
    switch (variant) {
      case 'dark':
        return 'border-gray-700 hover:bg-gray-800';
      case 'bright':
        return 'border-orange-200 hover:bg-orange-50';
      case 'pastel':
        return 'border-green-200 hover:bg-green-50';
      case 'monochrome':
        return 'border-gray-400 hover:bg-gray-200';
      default:
        return 'border-gray-200 hover:bg-gray-50';
    }
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${offerLayouts[variant]}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Earn Account earnings performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className={`flex items-center justify-between p-4 border-b last:border-b-0 rounded-lg transition-colors ${getItemStyles()}`}
          >
            <div className="flex items-center gap-3">
              {getCryptoIcon(product.currency)}
              <div>
                <div className="font-medium">
                  {getCryptoName(product.currency)}
                </div>
                <div className="text-sm opacity-70">
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
                  <Button 
                    variant={variant === 'dark' ? 'secondary' : 'default'} 
                    size="sm"
                  >
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
                      variant={variant}
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
        <p className="text-sm opacity-70 text-center mt-4">
          APY based on previous 14-day performance
        </p>
      </CardContent>
    </Card>
  );
};