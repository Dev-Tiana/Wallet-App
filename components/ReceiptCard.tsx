'use client';

import { Card, CardContent, Typography, Button, Divider, Box } from '@mui/material';

export default function ReceiptCard({ receipt }: any) {
  if (!receipt) {
    return <Typography>No receipt found.</Typography>;
  }

  const formatCurrency = (value: number, currency: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
          Transaction Receipt
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Transaction Details */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Transaction Details</Typography>
          <Typography><strong>Reference:</strong> {receipt.id}</Typography>
          <Typography><strong>Type:</strong> {receipt.type}</Typography>
          <Typography><strong>Date:</strong> {new Date(receipt.createdAt).toLocaleString()}</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Recipient Info */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Recipient Information</Typography>
          <Typography><strong>Name:</strong> {receipt.recipientName}</Typography>
          <Typography><strong>Account:</strong> {receipt.recipientAccount}</Typography>
          <Typography><strong>Bank:</strong> {receipt.bankName}</Typography>
          <Typography><strong>SWIFT Code:</strong> {receipt.swiftCode}</Typography>
          <Typography><strong>Email:</strong> {receipt.email}</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Transaction Info */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Payment</Typography>
          <Typography><strong>Amount:</strong> {formatCurrency(receipt.amount, receipt.currency)}</Typography>
          <Typography><strong>Balance After:</strong> {formatCurrency(receipt.balanceAfter, receipt.currency)}</Typography>
          <Typography><strong>Status:</strong> {receipt.transactionStatus}</Typography>
          <Typography><strong>Alert Caption:</strong> {receipt.alertCaption}</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Download PDF */}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          href={`/api/receipt/${receipt.id}`}
        >
          Download PDF
        </Button>
      </CardContent>
    </Card>
  );
}
