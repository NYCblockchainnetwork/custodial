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
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{product.name}</span>
          <span className="text-secondary">{product.apy}% APY</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{product.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="earn-label">Min Deposit</p>
              <p className="earn-stat">{product.minDeposit} {product.currency}</p>
            </div>
            <div>
              <p className="earn-label">Risk Level</p>
              <p className="earn-stat">{product.riskLevel}</p>
            </div>
          </div>
          <Button 
            onClick={() => onInvest(product)}
            className="w-full"
          >
            Earn Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};