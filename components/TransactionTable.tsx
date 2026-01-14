'use client';

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from '@mui/material';
import Link from 'next/link';
import { Transaction } from '@/types';  // <-- use your Transaction type

interface Props {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: Props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Type</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Balance After</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Receipt</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell>
              <Chip
                label={tx.type}
                color={tx.type === 'FUND' ? 'success' : 'error'}
              />
            </TableCell>
            <TableCell>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(tx.amount)}
            </TableCell>
            <TableCell>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(tx.balanceAfter)}
            </TableCell>
            <TableCell>
              {new Date(tx.createdAt).toLocaleString()}
            </TableCell>
            <TableCell>
              <Link href={`/receipt/${tx.id}`}>View</Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
