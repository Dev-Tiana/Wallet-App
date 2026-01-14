'use client';

import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import CardFundingForm from '@/components/fund/CardFundingForm';
import BankTransferInfo from '@/components/fund/BankTransferInfo';
import { useWallet } from '@/context/WalletContext';   // <-- use context
import { Transaction } from '@/types';
import { useRouter } from 'next/navigation';

export default function FundPage() {
  const [method, setMethod] = useState(0);
  const { balance, transactions, addTransaction } = useWallet(); // <-- get global wallet state
  const router = useRouter();

  const handleSuccess = (tx: Transaction) => {
    const updatedTx = [tx, ...transactions]; // preserve history
    const newBalance = Number(tx.balanceAfter) || 0;

    addTransaction(tx); // update global state

    router.push(`/receipt/${tx.id}`);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Fund Wallet
      </Typography>

      <Tabs
        value={method}
        onChange={(_, v) => setMethod(v)}
        sx={{ mb: 3 }}
      >
        <Tab label="Debit / Credit Card" />
        <Tab label="Bank Transfer" />
      </Tabs>

      <Box>
        {method === 0 && (
          <CardFundingForm balance={balance} onSuccess={handleSuccess} />
        )}
        {method === 1 && <BankTransferInfo />}
      </Box>
    </Container>
  );
}
