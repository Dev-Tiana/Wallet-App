'use client';

import { Card, CardContent, Typography } from '@mui/material';
import { useWallet } from '@/context/WalletContext';  // <-- import context

export default function BalanceCard() {
  const { balance } = useWallet();  // <-- get balance from context

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(balance);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Wallet Balance</Typography>
        <Typography variant="h4">{formattedBalance}</Typography>
      </CardContent>
    </Card>
  );
}
