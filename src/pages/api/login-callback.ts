import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, cookies }) => {
  const sessionId = url.searchParams.get('session_id') || '';

  cookies.set('session_id', sessionId, {
    httpOnly: true,
  });

  return new Response(
    JSON.stringify({
      sessionId
    }),
    {
      headers: {
        'content-type': 'application/json'
      }
    }
  );
};
