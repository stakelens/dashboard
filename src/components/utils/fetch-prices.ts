import { fetchWithRetry } from './fetch-with-retry';

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

export async function fetchPrices(input: FetchPrice): Promise<Record<number, number> | null> {
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
