'use client';

import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Divider,
  CircularProgress,
  Box,
  Paper,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PaymentIcon from '@mui/icons-material/Payment';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useExchangeRates from '@/hooks/useExchangeRates';
import { createTransaction } from '@/app/actions/walletActions';
import { getWallet, saveWallet } from '@/lib/storage';

export default function SendMoneyPage() {
  const router = useRouter();

  // wallet
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const wallet = getWallet();
    setBalance(wallet.balance);
  }, []);

  // sender
  const [senderEmail, setSenderEmail] = useState('');

  // recipient
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [amount, setAmount] = useState<number | ''>('');

  // metadata
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [transactionStatus, setTransactionStatus] =
    useState<'Successful' | 'Pending' | 'Failed'>('Pending');
  const [alertCaption, setAlertCaption] = useState('Gift card required');

  // exchange rates
  const { rates, loading, error, fetchRates } = useExchangeRates('USD');
  const popular = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'JPY', 'AUD', 'CNY', 'KES', 'ZAR'];
  const currencyOptions = rates ? Object.keys(rates).sort() : popular;

  const handleSend = async () => {
    if (!senderEmail || !recipientEmail || !amount) {
      alert('Please fill all required fields');
      return;
    }

    const tx = await createTransaction('SEND', Number(amount), balance, {
      senderEmail,
      recipientName,
      recipientEmail,
      recipientAccount,
      bankName,
      swiftCode,
      currency: selectedCurrency,
      transactionStatus,
      alertCaption,
    });

    const wallet = getWallet();
    saveWallet(tx.balanceAfter, [tx, ...wallet.transactions]);

    router.push(`/receipt/${tx.id}`);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        {/* Header */}
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          Send Money
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Wallet Balance: <strong>${balance.toFixed(2)}</strong>
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Sender Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AccountCircleIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="bold">
            Sender Information
          </Typography>
        </Box>
        <TextField
          label="Sender Email"
          fullWidth
          margin="dense"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
        />

        <Divider sx={{ my: 3 }} />

        {/* Recipient Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PersonAddIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="bold">
            Recipient Information
          </Typography>
        </Box>
        <TextField label="Recipient Name" fullWidth margin="dense" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
        <TextField label="Recipient Email" fullWidth margin="dense" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} />
        <TextField label="Recipient Account" fullWidth margin="dense" value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} />
        <TextField label="Bank Name" fullWidth margin="dense" value={bankName} onChange={(e) => setBankName(e.target.value)} />
        <TextField label="SWIFT Code" fullWidth margin="dense" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} />

        <Divider sx={{ my: 3 }} />

        {/* Transaction Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PaymentIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="bold">
            Transaction Details
          </Typography>
        </Box>
        <TextField
          label="Amount"
          type="number"
          fullWidth
          margin="dense"
          value={amount}
          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel>Currency</InputLabel>
          <Select
            value={selectedCurrency}
            label="Currency"
            onOpen={fetchRates}
            onChange={(e) => setSelectedCurrency(String(e.target.value))}
          >
            {loading && (
              <MenuItem disabled>
                <CircularProgress size={18} sx={{ mr: 1 }} /> Loading rates...
              </MenuItem>
            )}
            {!loading &&
              currencyOptions.map((c) => (
                <MenuItem key={c} value={c}>
                  {c} {rates?.[c] ? `— ${rates[c].toFixed(4)}` : ''}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            value={transactionStatus}
            label="Status"
            onChange={(e) => setTransactionStatus(e.target.value as any)}
          >
            <MenuItem value="Successful">Successful</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Failed">Failed</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Alert Caption</InputLabel>
          <Select
            value={alertCaption}
            label="Alert Caption"
            onChange={(e) => setAlertCaption(String(e.target.value))}
          >
            <MenuItem value="Gift card required">Gift card required</MenuItem>
            <MenuItem value="Account authentication required">Account authentication required</MenuItem>
            <MenuItem value="Include gift card">Include gift card</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select>
        </FormControl>

        {/* Review Summary */}
        {amount && recipientName && (
          <Paper
            elevation={2}
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: '#f5f5f5',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Review Transfer
            </Typography>
            <Typography variant="body2">
              <strong>Recipient:</strong> {recipientName} ({recipientEmail})
            </Typography>
            <Typography variant="body2">
              <strong>Account:</strong> {recipientAccount} — {bankName}
            </Typography>
            <Typography variant="body2">
              <strong>Amount:</strong> {amount} {selectedCurrency}
            </Typography>
            <Typography variant="body2">
              <strong>Status:</strong> {transactionStatus}
            </Typography>
            <Typography variant="body2">
              <strong>Alert:</strong> {alertCaption}
            </Typography>
          </Paper>
        )}

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{
              py: 1.5,
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: 2,
            }}
            onClick={handleSend}
          >
            Confirm Transfer
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            size="large"
            sx={{
              py: 1.5,
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: 2,
            }}
            onClick={() => router.push('/')}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
