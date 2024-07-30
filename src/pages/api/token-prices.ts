import { tokenPriceManager } from '@/server/tokens/token-price-manager';
import type { APIRoute } from 'astro';
import z from 'astro/zod';

const TokenPriceSchema = z
  .object({
    pair: z.object({
      baseToken: z.string(),
      quoteToken: z.string()
    }),
    range: z.object({
      from: z.number(),
      to: z.number()
    })
  })
  .refine((data) => data.range.from < data.range.to, {
    message: 'Invalid range'
  });

export const POST: APIRoute = async ({ request }) => {
  try {
    const json = await request.json();

    const parsed = TokenPriceSchema.safeParse(json);

    if (!parsed.success) {
      return new Response('Invalid range', {
        status: 400
      });
    }

    const prices = await tokenPriceManager.getPrices(parsed.data);

    if (prices == null) {
      return new Response('Missing data', {
        status: 400
      });
    }

    return new Response(JSON.stringify(prices), {
      headers: {
        'content-type': 'application/json'
      }
    });
  } catch {
    return new Response('Internal server error', {
      status: 500
    });
  }
};
