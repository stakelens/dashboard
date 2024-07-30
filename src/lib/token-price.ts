import { fetchWithRetry } from './utils';

type Token = 'RPL' | 'WETH' | 'USDC';

type FetchPrice = {
  pair: {
    baseToken: Token;
    quoteToken: Token;
  };
  range: {
    from: number;
    to: number;
  };
};

export async function fetchPrices(input: FetchPrice): Promise<Record<string, number> | null> {
  return await fetchWithRetry({
    url: '/api/token-prices',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input),
    RETRY_DELAY: 1000
  });
}
