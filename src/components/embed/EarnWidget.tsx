import React, { useEffect, useState } from 'react';
import { useEarnAPI } from '@/hooks/useEarnAPI';
import { EarnProduct } from '@/types/earn';
import { Button } from '@/components/ui/button';
import { EmbedEarnProduct, adaptProductToEarnType } from '@/types/embed';

interface EarnWidgetProps {
  partnerId: string;
  theme?: 'light' | 'dark' | string;
  onEarn?: (product: EarnProduct) => void;
  containerClass?: string;
}

/**
 * Embeddable widget component that partners can use in their applications
 * Provides a simple, contained interface for the Earn functionality
 */
export const EarnWidget: React.FC<EarnWidgetProps> = ({
  partnerId,
  theme = 'light',
  onEarn,
  containerClass = '',
}) => {
  const { products, isLoading, error } = useEarnAPI(partnerId);
  const [selectedProduct, setSelectedProduct] = useState<EarnProduct | null>(null);

  // Convert products from API to our internal EarnProduct type if needed
  const earnProducts: EarnProduct[] = Array.isArray(products) 
    ? products.map(product => {
        // If the product already matches our EarnProduct interface, use it directly
        if ('currency' in product && 'minDeposit' in product) {
          return product as EarnProduct;
        }
        // Otherwise, adapt it from the embed product type
        return adaptProductToEarnType(product as unknown as EmbedEarnProduct);
      })
    : [];

  // Apply partner-specific theme
  useEffect(() => {
    // Add theme class to container
    if (theme === 'dark') {
      document.documentElement.classList.add('theme-dark');
    } else if (theme.startsWith('partner-')) {
      document.documentElement.classList.add(`theme-${theme}`);
    }
    
    return () => {
      // Clean up theme classes on unmount
      document.documentElement.classList.remove('theme-dark');
      if (theme.startsWith('partner-')) {
        document.documentElement.classList.remove(`theme-${theme}`);
      }
    };
  }, [theme]);

  const handleProductSelect = (product: EarnProduct) => {
    setSelectedProduct(product);
    if (onEarn) {
      onEarn(product);
    }
  };

  if (isLoading) {
    return (
      <div className={`p-4 rounded-lg border earn-widget ${containerClass}`}>
        <p className="text-center py-4">Loading Earn products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg border earn-widget ${containerClass}`}>
        <p className="text-center text-error py-4">
          Failed to load Earn products. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border earn-widget ${containerClass}`}>
      <h2 className="text-xl font-bold mb-4">Earn Products</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {earnProducts.map((product) => (
          <div 
            key={product.id} 
            className="p-4 rounded-lg border hover:shadow-md transition-all bg-card text-card-foreground"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{product.currency}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-secondary">{product.apy}% APY</span>
                <p className="text-sm text-gray-600">
                  Min: {product.minDeposit} {product.currency}
                </p>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => handleProductSelect(product)}
            >
              Earn Now
            </Button>
          </div>
        ))}
      </div>
      
      {earnProducts.length === 0 && (
        <p className="text-center py-4">No Earn products available at this time.</p>
      )}
    </div>
  );
};

export default EarnWidget;
