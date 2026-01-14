// hooks/useExchangeRates.ts
'use client';

import { useEffect, useState } from 'react';

export type RatesMap = Record<string, number>;

export default function useExchangeRates(base = 'USD') {
  const [rates, setRates] = useState<RatesMap | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<number | null>(null);

  const fetchRates = async () => {
    // Prevent duplicate fetches
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
      if (!res.ok) {
        throw new Error(`Rates fetch failed: ${res.status}`);
      }
      const data = await res.json();
      if (data && data.result === 'success' && data.rates) {
        setRates(data.rates as RatesMap);
        setTimestamp(data.time_last_update_unix ? Number(data.time_last_update_unix) * 1000 : Date.now());
      } else {
        // fallback: if API changed shape or returned error
        throw new Error('Invalid rates response');
      }
    } catch (err: any) {
      console.error('Failed to load exchange rates', err);
      setError(err?.message ?? 'Failed to fetch rates');
      setRates(null);
    } finally {
      setLoading(false);
    }
  };

  // automatic fetch on mount
  useEffect(() => {
    fetchRates();
    // do not include fetchRates in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base]);

  return { rates, loading, error, timestamp, fetchRates };
}
