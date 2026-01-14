// components/SendMoneyDialog.tsx
'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Divider,
  CircularProgress,
  Box,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useExchangeRates from '@/hooks/useExchangeRates';
import { createTransaction } from '@/app/actions/walletActions';

export default function SendMoneyDialog({ balance, onSuccess }: { balance: number; onSuccess: (tx: any) => void; }) {
  const [open, setOpen] = useState(false);

  // Sender
  const [senderEmail, setSenderEmail] = useState('');

  // Recipient
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [amount, setAmount] = useState<number | ''>('');

  // transaction metadata
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [transactionStatus, setTransactionStatus] = useState<'Successful' | 'Pending' | 'Failed'>('Pending');
  const [alertCaption, setAlertCaption] = useState('Gift card required');

  // exchange rates hook (base USD)
  const { rates, loading, error, fetchRates } = useExchangeRates('USD');

  // list of currencies to show in dropdown (popular + a few extras)
  const popular = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'JPY', 'AUD', 'CNY', 'KES', 'ZAR'];

  // derived currency list: prefer rates keys (when fetched), otherwise fallback to popular
  const currencyOptions = rates ? Object.keys(rates).sort() : popular;

  // ensure defaults set on mount
  useEffect(() => {
    setSelectedCurrency((s) => s || 'USD');
  }, []);

  // fetch rates on dropdown open (only if not fetched)
  const handleCurrencyOpen = async () => {
    if (!rates && !loading) {
      await fetchRates();
    }
  };

  const handleSend = async () => {
    if (!senderEmail || !recipientEmail || !amount || !selectedCurrency) {
      alert('Please fill required fields: sender email, recipient email, amount, currency.');
      return;
    }

    try {
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

      onSuccess(tx);
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert('Transaction failed. Please try again.');
    }
  };

  return (
    <>
      <Button variant="outlined" color="error" onClick={() => setOpen(true)}>Send Money</Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Money</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>Sender Details</Typography>
          <TextField label="Sender Email" fullWidth margin="dense" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} />

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">Recipient Details</Typography>
          <TextField label="Recipient Name" fullWidth margin="dense" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
          <TextField label="Recipient Email" fullWidth margin="dense" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} />
          <TextField label="Recipient Account" fullWidth margin="dense" value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} />
          <TextField label="Bank Name" fullWidth margin="dense" value={bankName} onChange={(e) => setBankName(e.target.value)} />
          <TextField label="SWIFT Code" fullWidth margin="dense" value={swiftCode} onChange={(e) => setSwiftCode(e.target.value)} />

          <Divider sx={{ my: 2 }} />

          <TextField label="Amount" type="number" fullWidth margin="dense" value={amount} onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')} />

          <FormControl fullWidth margin="dense">
            <InputLabel>Currency</InputLabel>
            <Select
              value={selectedCurrency}
              label="Currency"
              onOpen={handleCurrencyOpen}
              onChange={(e) => setSelectedCurrency(String(e.target.value))}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              {loading && (
                <MenuItem disabled>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    <CircularProgress size={18} sx={{ mr: 1 }} /> Loading rates...
                  </Box>
                </MenuItem>
              )}

              {!loading && error && (
                <MenuItem disabled>
                  Rates unavailable — using default list
                </MenuItem>
              )}

              {!loading && currencyOptions.map((c) => {
                // show rate if available
                const r = rates?.[c];
                return (
                  <MenuItem key={c} value={c}>
                    {c} {r ? ` — ${r.toFixed(4)}` : ''}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Alert Caption</InputLabel>
            <Select value={alertCaption} label="Alert Caption" onChange={(e) => setAlertCaption(String(e.target.value))}>
              <MenuItem value="Gift card required">Gift card required</MenuItem>
              <MenuItem value="Account authentication required">Account authentication required</MenuItem>
              <MenuItem value="Include gift card">Include gift card</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select value={transactionStatus} label="Status" onChange={(e) => setTransactionStatus(e.target.value as any)}>
              <MenuItem value="Successful">Successful</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Button fullWidth variant="contained" onClick={handleSend}>Confirm Send</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
