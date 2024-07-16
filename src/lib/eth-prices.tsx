import { useEffect, useState } from 'react';
import { fetchPrices } from './token-price';
import { YEAR } from './time-constants';

export function useETHPrice() {
  const [ethPrices, setEthPrices] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    fetchPrices({
      token: 'ethereum',
      range: {
        to: Date.now(),
        from: Date.now() - YEAR
      }
    }).then(setEthPrices);
  }, []);

  return ethPrices;
}
