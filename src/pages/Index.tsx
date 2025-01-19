import { useQuery } from '@tanstack/react-query';
import { createEarnAPI } from '@/services/earnApi';
import { ProductCard } from '@/components/earn/ProductCard';
import { TransactionForm } from '@/components/earn/TransactionForm';
import { TransactionHistory } from '@/components/earn/TransactionHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Initialize API with configuration
const earnApi = createEarnAPI(
  import.meta.env.VITE_API_BASE_URL || 'https://api-sandbox.coinchange.io',
  import.meta.env.VITE_API_KEY || ''
);

const Index = () => {
  const { toast } = useToast();

  // Fetch products
  const { data: products = [] } = useQuery({
    queryKey: ['earnProducts'],
    queryFn: () => earnApi.getProducts(),
  });

  // Fetch balances
  const { data: balances = [] } = useQuery({
    queryKey: ['earnBalances'],
    queryFn: () => earnApi.getBalances(),
  });

  // Fetch transactions
  const { data: transactions = [] } = useQuery({
    queryKey: ['earnTransactions'],
    queryFn: () => earnApi.getTransactions(),
  });

  const handleInvest = async (amount: number) => {
    try {
      await earnApi.deposit(amount, 'USDC');
      toast({
        title: "Investment Successful",
        description: `Successfully invested ${amount} USDC`,
      });
    } catch (error) {
      toast({
        title: "Investment Failed",
        description: "There was an error processing your investment",
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = async (amount: number) => {
    try {
      await earnApi.withdraw(amount, 'USDC');
      toast({
        title: "Withdrawal Successful",
        description: `Successfully withdrew ${amount} USDC`,
      });
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Products Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Earn Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onInvest={() => {}}
            />
          ))}
        </div>
      </section>

      {/* Transaction Section */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="deposit">
              <TabsList>
                <TabsTrigger value="deposit">Deposit</TabsTrigger>
                <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
              </TabsList>
              <TabsContent value="deposit">
                <TransactionForm
                  type="deposit"
                  currency="USDC"
                  maxAmount={1000000}
                  onSubmit={handleInvest}
                />
              </TabsContent>
              <TabsContent value="withdraw">
                <TransactionForm
                  type="withdrawal"
                  currency="USDC"
                  maxAmount={balances[0]?.available || 0}
                  onSubmit={handleWithdraw}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* Transaction History Section */}
      <section>
        <TransactionHistory transactions={transactions} />
      </section>
    </div>
  );
};

export default Index;