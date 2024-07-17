import { fetchWithRetry } from './utils';

type FetchPrice = {
  token: 'ethereum' | 'rocketPool';
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
