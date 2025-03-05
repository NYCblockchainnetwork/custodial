
import React from 'react';
import { Bitcoin, CircleDollarSign, Coins, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EarnProduct } from '@/types/earn';
import { LayoutVariant } from '@/lib/layoutVariants';

interface EarnProductItemProps {
  product: EarnProduct;
  variant?: LayoutVariant;
  onEarnClick: (product: EarnProduct) => void;
  className?: string;
}

export const EarnProductItem = ({ 
  product, 
  variant = 'default',
  onEarnClick,
  className = ''
}: EarnProductItemProps) => {
  
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
    <div
      className={`flex items-center justify-between p-3 border-b last:border-b-0 rounded-lg transition-colors ${getItemStyles()} ${className}`}
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
        <Button 
          variant={variant === 'dark' ? 'secondary' : 'default'} 
          size="sm"
          onClick={() => onEarnClick(product)}
        >
          Earn
        </Button>
      </div>
    </div>
  );
};
