import { tokenPriceManager } from '@/server/tokens/token-price-manager';
import { TOKENS } from '@/server/tokens/tokens';
import type { APIRoute } from 'astro';
import z from 'astro/zod';

const RangeSchema = z
  .object({
    from: z.number(),
    to: z.number()
  })
  .refine((data) => data.from < data.to, {
    message: 'Invalid range'
  });

export const POST: APIRoute = async ({ request }) => {
  let { token, range } = await request.json();

  if (!(token in TOKENS)) {
    return new Response('Invalid token', {
      status: 400
    });
  }

  const parsedRange = RangeSchema.safeParse(range);

  if (!parsedRange.success) {
    return new Response('Invalid range', {
      status: 400
    });
  }

  const prices = await tokenPriceManager.getPrices({ token, range: parsedRange.data });

  return new Response(JSON.stringify(prices), {
    headers: {
      'content-type': 'application/json'
    }
  });
};
