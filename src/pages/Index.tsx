
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/earn/ProductCard';
import { TransactionForm } from '@/components/earn/TransactionForm';
import { TransactionHistory } from '@/components/earn/TransactionHistory';
import { OffersList } from '@/components/earn/OffersList';
import { BasicWithdrawalForm } from '@/components/earn/BasicWithdrawalForm';
import { BasicDepositForm } from '@/components/earn/BasicDepositForm';
import { ApiConfigPanel } from '@/components/earn/ApiConfigPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { earnApi } from '@/services/earnApi';
import { useState } from 'react';

const Index = () => {
  const { toast } = useToast();
  const [apiConfig, setApiConfig] = useState({ useMockData: true });

  // Fetch products
  const { data: products = [], refetch: refetchProducts } = useQuery({
    queryKey: ['earnProducts', apiConfig],
    queryFn: () => earnApi.getProducts(),
  });

  // Fetch balances
  const { data: balances = [], refetch: refetchBalances } = useQuery({
    queryKey: ['earnBalances', apiConfig],
    queryFn: () => earnApi.getBalances(),
  });

  // Fetch transactions
  const { data: transactions = [], refetch: refetchTransactions } = useQuery({
    queryKey: ['earnTransactions', apiConfig],
    queryFn: () => earnApi.getTransactions(),
  });

  const handleApiConfigChange = (newConfig: { useMockData: boolean }) => {
    setApiConfig(newConfig);
    
    // Refetch data with new config
    setTimeout(() => {
      refetchProducts();
      refetchBalances();
      refetchTransactions();
    }, 0);
  };

  const handleDeposit = async (amount: number, currency: string) => {
    try {
      await earnApi.deposit(amount, currency);
      toast({
        title: "Deposit Successful",
        description: `Successfully deposited ${amount} ${currency}`,
      });
      refetchBalances();
      refetchTransactions();
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "There was an error processing your deposit",
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = async (amount: number, currency: string) => {
    try {
      await earnApi.withdraw(amount, currency);
      toast({
        title: "Withdrawal Successful",
        description: `Successfully withdrew ${amount} ${currency}`,
      });
      refetchBalances();
      refetchTransactions();
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
      {/* API Configuration Panel */}
      <section>
        <ApiConfigPanel onConfigChange={handleApiConfigChange} />
      </section>

      {/* Offers Section */}
      <section>
        <OffersList />
      </section>

      {/* Products Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Earn Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEarn={() => {}}
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
                  onSubmit={handleDeposit}
                />
              </TabsContent>
              <TabsContent value="withdraw">
                <TransactionForm
                  type="withdrawal"
                  currency="USDC"
                  maxAmount={balances?.[0]?.available || 0}
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

      {/* Basic Form Examples Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Basic Withdrawal Form Example</h3>
          <BasicWithdrawalForm 
            onSubmit={async (amount) => {
              console.log('Withdrawal amount:', amount);
            }}
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Basic Deposit Form Example</h3>
          <BasicDepositForm 
            onSubmit={async (amount) => {
              console.log('Deposit amount:', amount);
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default Index;
