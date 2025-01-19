import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { formLayouts, LayoutVariant } from '@/lib/layoutVariants';

interface TransactionFormProps {
  type: 'deposit' | 'withdrawal';
  currency: string;
  maxAmount: number;
  onSubmit: (amount: number) => Promise<void>;
  variant?: LayoutVariant;
}

export const TransactionForm = ({ 
  type, 
  currency, 
  maxAmount, 
  onSubmit,
  variant = 'default' 
}: TransactionFormProps) => {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        description: `Maximum amount is ${maxAmount} ${currency}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(numAmount);
      setAmount('');
      toast({
        title: "Success",
        description: `Your ${type} of ${numAmount} ${currency} has been processed`,
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
      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-2">
          Amount ({currency})
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
        <div className="flex gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPercentage(0.25)}
            className="flex-1"
          >
            25%
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPercentage(0.5)}
            className="flex-1"
          >
            50%
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPercentage(0.75)}
            className="flex-1"
          >
            75%
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPercentage(1)}
            className="flex-1"
          >
            100%
          </Button>
        </div>
        <p className="text-sm mt-1 opacity-70">
          Available: {maxAmount} {currency}
        </p>
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