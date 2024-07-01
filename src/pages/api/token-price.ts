import { getTokenPrice } from '@/token-price';
import type { APIRoute } from 'astro';

const tokens = ['ethereum', 'rocket-pool'];

export const POST: APIRoute = async ({ request }) => {
  const { token } = await request.json();

  if (!tokens.includes(token)) {
    return new Response('Invalid token', {
      status: 500
    });
  }

  const price = await getTokenPrice(token);

  return new Response(
    JSON.stringify({
      price
    }),
    {
      headers: {
        'content-type': 'application/json'
      }
    }
  );
};
