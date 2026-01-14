'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction } from '@/types';
import { getWallet, saveWallet } from '@/lib/storage';

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load wallet from localStorage on mount
  useEffect(() => {
    const wallet = getWallet();
    setBalance(wallet.balance);
    setTransactions(wallet.transactions);
  }, []);

  const addTransaction = (tx: Transaction) => {
    // Use balanceAfter if provided, otherwise calculate based on type
    const newBalance =
      tx.balanceAfter ??
      (tx.type === 'SEND' ? balance - tx.amount : balance + tx.amount);

    setBalance(newBalance);
    setTransactions(prev => {
      const updated = [tx, ...prev];
      // Persist to localStorage
      saveWallet(newBalance, updated);
      return updated;
    });
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, addTransaction }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
