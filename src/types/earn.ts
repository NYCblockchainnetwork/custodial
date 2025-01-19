export interface EarnProduct {
  id: string;
  name: string;
  currency: string;
  apy: number;
  minDeposit: number;
  maxDeposit: number;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface Balance {
  currency: string;
  total: number;
  available: number;
  earning: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'earning';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}

export interface EarnStats {
  totalBalance: number;
  totalEarnings: number;
  dailyEarnings: number;
  currency: string;
}