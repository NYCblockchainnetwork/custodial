
import { EarnProduct } from '@/types/earn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bitcoin, CircleDollarSign, Coins, DollarSign } from 'lucide-react';
import { LayoutVariant } from '@/lib/layoutVariants';

interface ProductCardProps {
  product: EarnProduct;
  onInvest: (product: EarnProduct) => void;
  className?: string;
  variant?: LayoutVariant;
}

/**
 * ProductCard Component
 * Displays individual earn product offerings with their details and APY
 */
export const ProductCard = ({ 
  product, 
  onInvest, 
  className = '',
  variant = 'default'
}: ProductCardProps) => {
  
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

  return (
    <Card className={`earn-card bg-white ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {getCryptoIcon(product.currency)}
            <span>{product.currency}</span>
          </div>
          <span className="text-secondary">{product.apy}% APY</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">{product.description}</p>
          <p className="text-xs">
            <span className="font-medium">Min:</span> {product.minDeposit} {product.currency} | 
            <span className="font-medium ml-1">Risk:</span> {product.riskLevel}
          </p>
          <Button 
            onClick={() => onInvest(product)}
            className="w-full"
          >
            Earn Now
          </Button>
          <p className="text-sm opacity-70 text-center mt-2">
            APY based on previous 14-day performance
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
