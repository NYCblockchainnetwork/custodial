import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { formLayouts, LayoutVariant } from '@/lib/layoutVariants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { createEarnAPI } from '@/services/earnApi';

const earnApi = createEarnAPI(
  import.meta.env.VITE_API_BASE_URL || 'https://api-sandbox.coinchange.io',
  import.meta.env.VITE_API_KEY || ''
);

interface TransactionFormProps {
  type: 'deposit' | 'withdrawal';
  currency?: string;
  maxAmount: number;
  onSubmit: (amount: number, currency: string) => Promise<void>;
  variant?: LayoutVariant;
}

export const TransactionForm = ({ 
  type, 
  currency: initialCurrency, 
  maxAmount: initialMaxAmount, 
  onSubmit,
  variant = 'default' 
}: TransactionFormProps) => {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency || 'USDC');

  const { data: products = [] } = useQuery({
    queryKey: ['earnProducts'],
    queryFn: () => earnApi.getProducts(),
  });

  const currentProduct = products.find(p => p.currency === selectedCurrency);
  const maxAmount = currentProduct?.maxDeposit || initialMaxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (numAmount > maxAmount) {
      toast({
        title: "Insufficient funds",
        description: `Maximum amount is ${maxAmount} ${selectedCurrency}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(numAmount, selectedCurrency);
      setAmount('');
      toast({
        title: "Success",
        description: `Your ${type} of ${numAmount} ${selectedCurrency} has been processed`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to process ${type}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const setPercentage = (percentage: number) => {
    const calculatedAmount = (maxAmount * percentage).toFixed(6);
    setAmount(calculatedAmount.toString());
  };

  return (
    <form onSubmit={handleSubmit} className={formLayouts[variant]}>
      <div className="space-y-4">
        <div>
          <label htmlFor="currency" className="block text-sm font-medium mb-2">
            Currency
          </label>
          <Select
            value={selectedCurrency}
            onValueChange={setSelectedCurrency}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg">
              {products.map((product) => (
                <SelectItem 
                  key={product.currency} 
                  value={product.currency}
                  className="flex justify-between items-center"
                >
                  <span>{product.currency}</span>
                  <span className="text-secondary text-sm">{product.apy}% APY</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-2">
            Amount ({selectedCurrency})
          </label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Enter ${type} amount`}
            min="0"
            max={maxAmount}
            step="0.000001"
            required
            className="w-full"
          />
          <div className="flex gap-1 mt-1 justify-start">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPercentage(0.25)}
              className="h-6 px-2 text-xs"
            >
              25%
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPercentage(0.5)}
              className="h-6 px-2 text-xs"
            >
              50%
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPercentage(0.75)}
              className="h-6 px-2 text-xs"
            >
              75%
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPercentage(1)}
              className="h-6 px-2 text-xs"
            >
              100%
            </Button>
          </div>
          <p className="text-sm mt-1 opacity-70">
            Available: {maxAmount} {selectedCurrency}
          </p>
        </div>
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-4"
      >
        {isSubmitting ? 'Processing...' : `Confirm ${type}`}
      </Button>
    </form>
  );
};