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
      // Create transaction
      const tx: Transaction = await createTransaction(
        'FUND',
        amount,
        balance, // pass current balance from context
        {
          senderEmail: email,
          recipientName: 'Wallet Funding',
          recipientEmail: email,
          recipientAccount: 'N/A',
          bankName: 'N/A',
          swiftCode: 'N/A',
          currency: 'USD',
          transactionStatus: 'Successful',
          alertCaption: 'Wallet funded successfully',
        }
      );

      // Add transaction globally (balance auto-updates in context)
      addTransaction(tx);

      setSuccess(true);
      setError(''); // Clear any previous errors

      // Redirect to receipt page
      setTimeout(() => {
        router.push(`/receipt/${tx.id}`);
      }, 1000);
    } catch (error) {
      console.error(error);
      setError('Failed to fund wallet, please try again later.');
    }
  };

  return (
    <>
      <Stack spacing={2}>
        <TextField
          label="Amount"
          type="number"
          onChange={(e) => setAmount(Number(e.target.value))}
          error={!!error}
          helperText={error}
        />

        <TextField
          label="Email for Receipt"
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

      <Snackbar open={success} autoHideDuration={2000}>
        <Alert severity="success">
          Wallet funded successfully with ${amount.toFixed(2)} 🎉
        </Alert>
      </Snackbar>

      {error && (
        <Snackbar open={!!error} autoHideDuration={2000}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </>
  );
}
