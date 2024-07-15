import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateToDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry(
  params: RequestInit & {
    url: string;
    MAX_ATTEMPTS?: number;
  }
) {
  for (let attempt = 0; attempt < (params.MAX_ATTEMPTS || 3); attempt++) {
    try {
      const response = await fetch(params.url, params);

      if (!response.ok) {
        throw new Error();
      }

      return await response.json();
    } catch (error) {
      await delay(60 * 1000);
    }
  }

  throw new Error('Max retries reached');
}

export const ONE_DAY = 1000 * 60 * 60 * 24;

export function getDatesInRange({ from, to }: { from: number; to: number }) {
  const dates: string[] = [];
  let currentDate = from;

  while (currentDate < to) {
    dates.push(formatDateToDDMMYYYY(new Date(currentDate)));
    currentDate += ONE_DAY;
  }

  return dates;
}
