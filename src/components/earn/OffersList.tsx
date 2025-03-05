
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
import { earnApi } from '@/services/earnApi';
import { EarnProduct } from '@/types/earn';

// Updated sample products to match the EarnProduct interface
const sampleProducts: EarnProduct[] = [
  {
    id: 'sample-usdc',
    name: 'USDC Earn',
    currency: 'USDC',
    apy: 9.5,
    minDeposit: 100,
    maxDeposit: 100000,
    description: 'Earn on your USDC holdings',
    riskLevel: 'Low'
  },
  {
    id: 'sample-usdt',
    name: 'USDT Earn',
    currency: 'USDT',
    apy: 9.5,
    minDeposit: 100,
    maxDeposit: 100000,
    description: 'Earn on your USDT holdings',
    riskLevel: 'Low'
  },
  {
    id: 'sample-eth',
    name: 'ETH Earn',
    currency: 'ETH',
    apy: 8.5,
    minDeposit: 0.05,
    maxDeposit: 1000,
    description: 'Earn on your ETH holdings',
    riskLevel: 'Medium'
  },
  {
    id: 'sample-btc',
    name: 'BTC Earn',
    currency: 'BTC',
    apy: 8.5,
    minDeposit: 0.01,
    maxDeposit: 100,
    description: 'Earn on your BTC holdings',
    riskLevel: 'Medium'
  },
  {
    id: 'sample-dai',
    name: 'DAI Earn',
    currency: 'DAI',
    apy: 9.5,
    minDeposit: 100,
    maxDeposit: 100000,
    description: 'Earn on your DAI holdings',
    riskLevel: 'Low'
  }
];

const getCryptoIcon = (currency: string) => {
  switch (currency.toUpperCase()) {
    case 'BTC':
      return <Bitcoin className="w-6 h-6" />;
    case 'ETH':
      return <Coins className="w-6 h-6" />;
    case 'USDC':
    case 'USDT':
    case 'DAI':
      return <DollarSign className="w-6 h-6" />;
    default:
      return <CircleDollarSign className="w-6 h-6" />;
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
  const { data: products = sampleProducts, isLoading, error } = useQuery({
    queryKey: ['earnProducts'],
    queryFn: () => earnApi.getProducts(),
    placeholderData: sampleProducts,
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
      case 'minimal':
        return 'border-none shadow-sm hover:shadow-md';
      case 'glass':
        return 'border-white/20 backdrop-blur-sm hover:bg-white/90';
      case 'gradient':
        return 'border-indigo-100 hover:from-indigo-100 hover:to-purple-100';
      case 'modern':
        return 'border-slate-100 hover:shadow-lg';
      case 'futuristic':
        return 'border-purple-500/30 hover:border-purple-400/40';
      case 'neo-brutalism':
        return 'border-[3px] border-black hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none';
      default:
        return 'border-gray-200 hover:bg-gray-50';
    }
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${offerLayouts[variant]}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">
          Earn Account earnings performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <div className="text-center py-4">Loading products...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            Error loading products. Using sample data.
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className={`flex items-center justify-between p-3 border-b last:border-b-0 rounded-lg transition-colors ${getItemStyles()}`}
            >
              <div className="flex items-center gap-3">
                {getCryptoIcon(product.currency)}
                <div>
                  <div className="font-medium">
                    {getCryptoName(product.currency)}
                  </div>
                  <div className="text-sm opacity-70">
                    {product.description}
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
                        onSubmit={async (amount, currency) => {
                          console.log('Deposit:', amount, 'Currency:', currency);
                        }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))
        )}
        <p className="text-sm opacity-70 text-center mt-2">
          APY based on previous 14-day performance
        </p>
      </CardContent>
    </Card>
  );
};
