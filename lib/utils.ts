export function generateTransactionId() {
  return 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

export function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}
