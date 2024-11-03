import { useEffect, useState } from 'react';
import { fetchPrices } from './token-price';
import { YEAR } from '../server/time-constants';

export function useETHPrice() {
  const [ethPrices, setEthPrices] = useState<Record<number, number> | null>(null);

  useEffect(() => {
    fetchPrices({
      pair: {
        baseToken: 'WETH',
        quoteToken: 'USDC'
      },
      range: {
        to: Date.now(),
        from: Date.now() - YEAR
      }
    }).then(setEthPrices);
  }, []);

  return ethPrices;
}
