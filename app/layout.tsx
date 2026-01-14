import Providers from '@/providers/Providers';

export const metadata = {
  title: 'Wallet App',
  description: 'Full-stack wallet with receipts and email',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap all children with Providers so global contexts (Wallet, Theme, etc.) are available */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
