
import { EarnProduct } from '@/types/earn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: EarnProduct;
  onInvest: (product: EarnProduct) => void;
  className?: string;
}

/**
 * ProductCard Component
 * Displays individual earn product offerings with their details and APY
 */
export const ProductCard = ({ product, onInvest, className = '' }: ProductCardProps) => {
  return (
    <Card className={`earn-card ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>{product.currency}</span>
          <span className="text-secondary">{product.apy}% APY</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">{product.description}</p>
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
