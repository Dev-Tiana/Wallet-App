'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';
import { lightTheme } from '@/theme/theme';
import { WalletProvider } from '@/context/WalletContext';  // <-- import your WalletProvider

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <WalletProvider>
          {children}
        </WalletProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
