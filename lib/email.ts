// 'use server';

// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY!);

// export async function sendReceiptEmail(receipt: any) {
//   if (!process.env.RESEND_API_KEY) {
//     throw new Error('RESEND_API_KEY is missing');
//   }

//   await resend.emails.send({
//     from: 'Wallet App <onboarding@resend.dev>', // ✅ VERIFIED sender
//     to: receipt.senderEmail, // ✅ sender receives receipt
//     subject: 'Transaction Receipt',
//     html: `
//       <h2>Transaction Receipt</h2>

//       <h3>Sender Details</h3>
//       <p><strong>Email:</strong> ${receipt.senderEmail}</p>

//       <h3>Recipient Details</h3>
//       <p><strong>Name:</strong> ${receipt.recipientName}</p>
//       <p><strong>Email:</strong> ${receipt.recipientEmail}</p>
//       <p><strong>Account:</strong> ${receipt.recipientAccount}</p>
//       <p><strong>Bank:</strong> ${receipt.bankName}</p>
//       <p><strong>SWIFT Code:</strong> ${receipt.swiftCode}</p>

//       <h3>Transaction Info</h3>
//       <p><strong>Reference:</strong> ${receipt.id}</p>
//       <p><strong>Type:</strong> ${receipt.type}</p>
//       <p><strong>Amount:</strong> ${receipt.amount} ${receipt.currency}</p>
//       <p><strong>Status:</strong> ${receipt.transactionStatus}</p>
//       <p><strong>Balance After:</strong> ${receipt.balanceAfter}</p>
//       <p><strong>Date:</strong> ${new Date(receipt.createdAt).toLocaleString()}</p>
//     `,
//   });
// }


'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendReceiptEmail(receipt: any) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is missing');
  }

  await resend.emails.send({
    from: 'Wallet App <onboarding@resend.dev>', // sandbox sender
    to: [receipt.senderEmail, receipt.recipientEmail], // ✅ BOTH
    subject: 'Transaction Receipt',
    html: `
      <h2>Transaction Receipt</h2>

      <h3>Sender Details</h3>
      <p><strong>Email:</strong> ${receipt.senderEmail}</p>

      <h3>Recipient Details</h3>
      <p><strong>Name:</strong> ${receipt.recipientName}</p>
      <p><strong>Email:</strong> ${receipt.recipientEmail}</p>
      <p><strong>Account:</strong> ${receipt.recipientAccount}</p>
      <p><strong>Bank:</strong> ${receipt.bankName}</p>
      <p><strong>SWIFT Code:</strong> ${receipt.swiftCode}</p>

      <h3>Transaction Info</h3>
      <p><strong>Reference:</strong> ${receipt.id}</p>
      <p><strong>Type:</strong> ${receipt.type}</p>
      <p><strong>Amount:</strong> ${receipt.amount} ${receipt.currency}</p>
      <p><strong>Status:</strong> ${receipt.transactionStatus}</p>
      <p><strong>Balance After:</strong> ${receipt.balanceAfter}</p>
      <p><strong>Date:</strong> ${new Date(receipt.createdAt).toLocaleString()}</p>
    `,
  });
}
