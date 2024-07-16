type FetchPrice = {
  token: 'ethereum' | 'rocketPool';
  range: {
    from: number;
    to: number;
  };
};

export async function fetchPrices(input: FetchPrice): Promise<Record<string, number> | null> {
  const response = await fetch('/api/token-prices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });

  return await response.json();
}
