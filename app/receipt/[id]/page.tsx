'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Divider,
  Box,
  Paper,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { getWallet } from '@/lib/storage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/HourglassEmpty';

interface Transaction {
  id: string;
  type: string;
  createdAt: string;
  recipientName?: string;
  recipientAccount?: string;
  bankName?: string;
  swiftCode?: string;
  email: string;
  amount: number;
  currency: string;
  balanceAfter: number;
  transactionStatus: string;
  alertCaption: string;
  fundingAccount?: string;
}

export default function ReceiptPage() {
  const params = useParams();
  const id = params?.id as string;
  const [tx, setTx] = useState<Transaction | null>(null);

  useEffect(() => {
    const wallet = getWallet();
    if (!wallet?.transactions) return;

    const transaction = wallet.transactions.find((t: Transaction) => t.id === id);
    if (transaction) {
      setTx(transaction);
    }
  }, [id]);

  if (!tx) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ mt: 5, p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            Transaction not found
          </Typography>
          <Button
            sx={{ mt: 3 }}
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = '/')}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  // Choose icon based on status
  const statusIcon =
    tx.transactionStatus === 'Successful' ? (
      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
    ) : tx.transactionStatus === 'Failed' ? (
      <ErrorIcon color="error" sx={{ mr: 1 }} />
    ) : (
      <PendingIcon color="warning" sx={{ mr: 1 }} />
    );

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card elevation={6} sx={{ borderRadius: 3 }}>
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {statusIcon}
            <Typography variant="h5" fontWeight="bold">
              Transaction Receipt
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {/* Transaction Info */}
          <Typography variant="body2" color="text.secondary">
            Transaction ID
          </Typography>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            {tx.id}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Type
          </Typography>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            {tx.type}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Date
          </Typography>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            {new Date(tx.createdAt).toLocaleString()}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Status
          </Typography>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            {tx.transactionStatus}
          </Typography>

          {tx.type === 'SEND' && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Recipient Name
              </Typography>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                {tx.recipientName}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Recipient Account
              </Typography>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                {tx.recipientAccount}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Bank Name
              </Typography>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                {tx.bankName}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                SWIFT Code
              </Typography>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                {tx.swiftCode}
              </Typography>
            </>
          )}

          {tx.type === 'FUND' && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Funding Account
              </Typography>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                {tx.fundingAccount}
              </Typography>
            </>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            Email
          </Typography>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            {tx.email}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Amount
          </Typography>
          <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
            {tx.amount} {tx.currency}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Balance After
          </Typography>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            {tx.balanceAfter}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Alert Caption
          </Typography>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            {tx.alertCaption}
          </Typography>

          {/* Back Button */}
          <Button
            sx={{ mt: 3 }}
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => (window.location.href = '/')}
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
