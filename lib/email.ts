'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

type ReceiptEmailPayload = {
  id: string;
  type: 'SEND' | 'FUND';
  amount: number;
  currency: string;
  balanceAfter: number;
  createdAt: string;
  transactionStatus: 'Successful' | 'Pending' | 'Failed';
  alertCaption: string;

  senderEmail?: string;
  recipientEmail?: string;
  recipientName?: string;
  recipientAccount?: string;
  bankName?: string;
  swiftCode?: string;
  email?: string; // fallback
};

export async function sendReceiptEmail(receipt: ReceiptEmailPayload) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is missing');
    return;
  }

  // ✅ Build recipient list safely
  const recipients = [
    receipt.senderEmail,
    receipt.recipientEmail,
    receipt.email, // fallback
  ].filter(Boolean) as string[];

  if (recipients.length === 0) {
    console.warn('No valid email recipients. Skipping email.');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Wallet App <onboarding@resend.dev>',
      to: recipients,
      subject: `Transaction Receipt – ${receipt.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color:#1976d2;">Transaction Receipt</h2>
          <p>${receipt.alertCaption}</p>

          <hr />

          <h3>Transaction Details</h3>
          <p><strong>Reference:</strong> ${receipt.id}</p>
          <p><strong>Type:</strong> ${receipt.type}</p>
          <p><strong>Amount:</strong> ${receipt.amount} ${receipt.currency}</p>
          <p><strong>Status:</strong> ${receipt.transactionStatus}</p>
          <p><strong>Balance After:</strong> ${receipt.balanceAfter} ${receipt.currency}</p>
          <p><strong>Date:</strong> ${new Date(receipt.createdAt).toLocaleString()}</p>

          <hr />

          <h3>Sender</h3>
          <p>${receipt.senderEmail || 'N/A'}</p>

          <h3>Recipient</h3>
          <p><strong>Name:</strong> ${receipt.recipientName || 'N/A'}</p>
          <p><strong>Email:</strong> ${receipt.recipientEmail || 'N/A'}</p>
          <p><strong>Account:</strong> ${receipt.recipientAccount || 'N/A'}</p>
          <p><strong>Bank:</strong> ${receipt.bankName || 'N/A'}</p>
          <p><strong>SWIFT Code:</strong> ${receipt.swiftCode || 'N/A'}</p>

          <p style="margin-top: 32px; font-size: 12px; color: #666;">
            This is an automated receipt from Wallet App.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send receipt email:', error);
  }
}
