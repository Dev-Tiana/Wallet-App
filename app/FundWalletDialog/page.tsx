'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useWallet } from '@/context/WalletContext';
import CardFundingForm from '@/components/fund/CardFundingForm';
import BankTransferInfo from '@/components/fund/BankTransferInfo';

export default function FundWalletPage() {
  const [method, setMethod] = useState(0);
  const { balance } = useWallet(); // reactive balance

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        {/* Header */}
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          Fund Wallet
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Current Balance: <strong>${balance.toFixed(2)}</strong>
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Tabs */}
        <Tabs
          value={method}
          onChange={(_, v) => setMethod(v)}
          variant="fullWidth"
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              fontWeight: 'bold',
              textTransform: 'none',
            },
            '& .Mui-selected': {
              color: 'primary.main',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
              height: 3,
              borderRadius: 2,
            },
          }}
        >
          <Tab
            icon={<CreditCardIcon />}
            iconPosition="start"
            label="Debit / Credit Card"
          />
          <Tab
            icon={<AccountBalanceIcon />}
            iconPosition="start"
            label="Bank Transfer"
          />
        </Tabs>

        {/* Content */}
        <Box sx={{ mt: 2 }}>
          {method === 0 && <CardFundingForm />}
          {method === 1 && <BankTransferInfo />}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
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
            onClick={() => alert('Confirm funding logic here')}
          >
            Confirm
          </Button>
          <Button
            fullWidth
            variant="outlined"
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
