'use server';

import { sendReceiptEmail } from '@/lib/email';
import { generateTransactionId } from '@/lib/utils';

export async function createTransaction(
  type: 'SEND' | 'FUND',
  amount: number,
  currentBalance: number,
  data: {
    senderEmail: string;
    recipientName: string;
    recipientEmail: string;
    recipientAccount: string;
    bankName: string;
    swiftCode: string;
    currency: string;
    transactionStatus: 'Successful' | 'Pending' | 'Failed';
    alertCaption: string;
  }
) {
  const id = generateTransactionId();

  // Calculate balance after transaction based on type
  const balanceAfter = type === 'SEND'
    ? currentBalance - amount
    : currentBalance + amount;

  const tx = {
    id,
    type,
    amount,
    balanceAfter,
    createdAt: new Date().toISOString(),
    ...data,
  };

  try {
    // Send the receipt email
    await sendReceiptEmail(tx);
  } catch (emailError) {
    console.error('Error sending email:', emailError);
    // Optionally, you can handle this by retrying, logging, or notifying the user
  }

  // Return the transaction object for further use (e.g., frontend updates)
  return tx;
}
