'use client';

import { Card, CardContent, Typography } from '@mui/material';

export default function BankTransferInfo() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Bank Transfer Details</Typography>
        <Typography>Bank: Wallet Demo Bank</Typography>
        <Typography>Account Name: Wallet App</Typography>
        <Typography>Account Number: 1234567890</Typography>
        <Typography>Reference: Use your email</Typography>
      </CardContent>
    </Card>
  );
}
