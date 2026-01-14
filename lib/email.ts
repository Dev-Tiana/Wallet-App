'use server';

import { Resend } from 'resend';

type Receipt = {
  id: string;
  type: 'SEND' | 'FUND';
  amount: number;
  currency: string;
  balanceAfter: number;
  createdAt: string;
  transactionStatus: 'Successful' | 'Pending' | 'Failed';
  alertCaption?: string;

  senderEmail?: string;
  recipientEmail?: string;
  recipientName?: string;
  recipientAccount?: string;
  bankName?: string;
  swiftCode?: string;
  email?: string; // fallback
};

export async function sendReceiptEmail(receipt: Receipt) {
  const apiKey = process.env.RESEND_API_KEY;

  // ✅ HARD GUARD – prevents crashes
  if (!apiKey) {
    console.error('RESEND_API_KEY missing. Email skipped.');
    return;
  }

  // ✅ Create Resend ONLY after key exists
  const resend = new Resend(apiKey);

  // ✅ Build recipient list safely
  const recipients = [
    receipt.senderEmail,
    receipt.recipientEmail,
    receipt.email,
  ].filter(Boolean) as string[];

  if (recipients.length === 0) {
    console.warn('No valid recipients. Email skipped.');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Wallet App <onboarding@resend.dev>',
      to: recipients,
      subject: `Transaction Receipt – ${receipt.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Transaction Receipt</h2>

          ${receipt.alertCaption ? `<p>${receipt.alertCaption}</p>` : ''}

          <hr />

          <p><strong>Reference:</strong> ${receipt.id}</p>
          <p><strong>Type:</strong> ${receipt.type}</p>
          <p><strong>Amount:</strong> ${receipt.amount} ${receipt.currency}</p>
          <p><strong>Status:</strong> ${receipt.transactionStatus}</p>
          <p><strong>Balance After:</strong> ${receipt.balanceAfter}</p>
          <p><strong>Date:</strong> ${new Date(receipt.createdAt).toLocaleString()}</p>

          <hr />

          <h4>Sender</h4>
          <p>${receipt.senderEmail || 'N/A'}</p>

          <h4>Recipient</h4>
          <p>${receipt.recipientName || 'N/A'}</p>
          <p>${receipt.recipientEmail || 'N/A'}</p>

          <p style="margin-top: 24px; font-size: 12px; color: #666;">
            This is an automated email from Wallet App.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send receipt email:', error);
  }
}
