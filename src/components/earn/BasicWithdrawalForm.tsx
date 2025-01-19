import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CircleDollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BasicWithdrawalFormProps {
  balance?: number;
  currency?: string;
  onSubmit?: (amount: number) => Promise<void>;
}

export const BasicWithdrawalForm = ({ 
  balance = 1767.8370,
  currency = 'USDC',
  onSubmit 
}: BasicWithdrawalFormProps) => {
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

    if (numAmount > balance) {
      toast({
        title: "Insufficient funds",
        description: `Maximum amount is ${balance} ${currency}`,
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
        description: `Your withdrawal of ${numAmount} ${currency} has been processed`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process withdrawal. Please try again.",
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
            <div className="text-2xl font-semibold">{balance} {currency}</div>
            <div className="text-sm text-muted-foreground">Earn Account Balance</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount to Withdraw
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              max={balance}
              step="0.000001"
              required
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-600 hover:bg-gray-700"
          >
            {isSubmitting ? 'Processing...' : 'Withdraw From Earn Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};