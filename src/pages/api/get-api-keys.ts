import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies }) => {
  const result = await fetch('http://localhost:3000/api_keys/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    //   session_id: cookies.get('session_id')?.value || ''
    }
  });

  if (!result.ok) {
    console.log("result.status: ", result.status)
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: {
        'content-type': 'application/json'
      }
    });
  }

  return new Response(JSON.stringify(await result.json()), {
    headers: {
      'content-type': 'application/json'
    }
  });
};
