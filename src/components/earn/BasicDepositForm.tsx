import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CircleDollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BasicDepositFormProps {
  apy?: number;
  currency?: string;
  maxAmount?: number;
  onSubmit?: (amount: number) => Promise<void>;
}

export const BasicDepositForm = ({ 
  apy = 7.4,
  currency = 'USDC',
  maxAmount = 1000000,
  onSubmit 
}: BasicDepositFormProps) => {
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

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(numAmount);
      }
      setAmount('');
      toast({
        title: "Success",
        description: `Your deposit of ${numAmount} ${currency} has been processed`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process deposit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-8 h-8" />
            <span className="text-2xl font-semibold">{currency}</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold">{apy}% APY</div>
            <div className="text-sm text-muted-foreground">Current Rate</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount to Deposit
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.000001"
              required
              className="w-full"
            />
            <p className="text-sm opacity-70">
              Available: {maxAmount} {currency}
            </p>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Processing...' : 'Deposit To Earn Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};