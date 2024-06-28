const options = {
  method: 'GET',
  headers: { accept: 'application/json', 'x-cg-api-key': import.meta.env.COIN_GECKO }
};

type TokenPriceCache = {
  price: number;
  timestamp: number;
};

const TOKEN_PRICE_CACHE: Map<string, TokenPriceCache> = new Map();
const CACHE_DURATION = 10_000;

export async function getTokenPrice(token: string): Promise<number> {
  const value = TOKEN_PRICE_CACHE.get(token);
  const now = Date.now();

  if (!value || now - value.timestamp > CACHE_DURATION) {
    const price = await fetchTokenPrice(token);

    TOKEN_PRICE_CACHE.set(token, {
      price: price,
      timestamp: now
    });

    return price;
  }

  return value.price;
}

async function fetchTokenPrice(token: string): Promise<number> {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`;
  const response = await fetch(url, options);
  const responseJSON = await response.json();
  return responseJSON[token].usd;
}
