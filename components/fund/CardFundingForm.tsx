'use client';

import { TextField, Button, Stack, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTransaction } from '@/app/actions/walletActions';
import { Transaction } from '@/types';
import { useWallet } from '@/context/WalletContext';

export default function CardFundingForm() {
  const router = useRouter();
  const { balance, addTransaction } = useWallet(); // get current balance + addTransaction
  const [amount, setAmount] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFund = async () => {
    // Validate input
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      // Generate transaction ID
      const id = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();

      // Create Transaction object
      const tx: Transaction = {
        id,
        type: 'FUND',
        amount,
        balanceAfter: balance + amount,
        senderEmail: email,
        recipientName: 'Wallet Funding',
        recipientEmail: email,
        recipientAccount: 'N/A',
        bankName: 'N/A',
        swiftCode: 'N/A',
        currency: 'USD',
        transactionStatus: 'Successful',
        createdAt: new Date().toISOString(),
        email, // required field for type
      };

      // Save transaction in backend (optional)
      await createTransaction(tx.type, tx.amount, balance, tx);

      // Update global wallet state
      addTransaction(tx);

      setSuccess(true);
      setError('');

      // Redirect to receipt page after 1s
      setTimeout(() => {
        router.push(`/receipt/${tx.id}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      setError('Failed to fund wallet, please try again later.');
    }
  };

  return (
    <>
      <Stack spacing={2}>
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          error={!!error}
          helperText={error}
        />

        <TextField
          label="Email for Receipt"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error}
        />

        <TextField label="Card Number" />
        <TextField label="Expiry Date" placeholder="MM/YY" />
        <TextField label="CVC" type="password" />

        <Button
          variant="contained"
          onClick={handleFund}
          disabled={amount <= 0 || !email.trim()}
        >
          Fund Wallet
        </Button>
      </Stack>

      <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
        <Alert severity="success">
          Wallet funded successfully with ${amount.toFixed(2)} 🎉
        </Alert>
      </Snackbar>

      {error && (
        <Snackbar open={!!error} autoHideDuration={2000} onClose={() => setError('')}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </>
  );
}
