import { Transaction } from '@/types';

const KEY = 'wallet';

export function getWallet() {
  if (typeof window === 'undefined')
    return { balance: 1000, transactions: [] };

  const stored = localStorage.getItem(KEY);
  return stored
    ? JSON.parse(stored)
    : { balance: 1000, transactions: [] };
}

export function saveWallet(balance: number, transactions: Transaction[]) {
  localStorage.setItem(
    KEY,
    JSON.stringify({ balance, transactions })
  );
}
