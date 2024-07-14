import { TokenPriceManager } from '@/token-price-manager';
import type { APIRoute } from 'astro';

const tokens = ['ethereum', 'rocket-pool'];

const tokenPriceManager = new TokenPriceManager();

export const POST: APIRoute = async ({ request }) => {
  let { token, dates } = await request.json();

  if (!Array.isArray(dates) || dates.length === 0) {
    return new Response('Invalid dates', {
      status: 400
    });
  }

  if (!tokens.includes(token)) {
    return new Response('Invalid token', {
      status: 400
    });
  }

  const prices = await tokenPriceManager.fetchTokenPrices(token, dates);

  return new Response(
    JSON.stringify({
      prices
    }),
    {
      headers: {
        'content-type': 'application/json'
      }
    }
  );
};
