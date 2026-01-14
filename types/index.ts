export type TransactionType = 'FUND' | 'SEND';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  email: string;
  balanceAfter: number;
  createdAt: string;
}
