import { Transaction } from '@/types/earn';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

/**
 * TransactionHistory Component
 * Displays a table of transaction history with filtering and sorting
 */
export const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Transaction History</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="capitalize">{tx.type}</TableCell>
              <TableCell>{tx.amount}</TableCell>
              <TableCell>{tx.currency}</TableCell>
              <TableCell className="capitalize">{tx.status}</TableCell>
              <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};