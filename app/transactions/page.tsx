'use client';

import { Container, Typography, Paper, Divider, Box, Button } from '@mui/material';
import TransactionTable from '@/components/TransactionTable';
import { useWallet } from '@/context/WalletContext';

export default function TransactionsPage() {
  const { transactions, balance } = useWallet(); // include balance for context

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            Transaction History
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Current Balance: <strong>${balance.toFixed(2)}</strong>
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Transaction Table */}
        <TransactionTable transactions={transactions} />

        {/* Back Home Button */}
        <Box sx={{ mt: 4 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              py: 1.5,
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: 2,
            }}
            onClick={() => (window.location.href = '/')}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
