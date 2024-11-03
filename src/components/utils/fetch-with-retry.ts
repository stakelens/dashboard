import { delay } from '@/server/utils';

export async function fetchWithRetry(
  params: RequestInit & {
    url: string;
    MAX_ATTEMPTS?: number;
    RETRY_DELAY?: number;
  }
) {
  const MAX_ATTEMPTS = params.MAX_ATTEMPTS || 3;
  const RETRY_DELAY = params.RETRY_DELAY || 60 * 1000; // Default to 60 seconds

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(params.url, params);

      if (!response.ok) {
        throw new Error();
      }

      return await response.json();
    } catch (error) {
      await delay(RETRY_DELAY);
    }
  }

  throw new Error('Max retries reached');
}
