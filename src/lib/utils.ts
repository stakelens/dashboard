import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DAY } from './time-constants';

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

export function getDatesInRange({ from, to }: { from: number; to: number }) {
  const dates: string[] = [];
  let currentDate = from;

  while (currentDate < to) {
    dates.push(formatDateToDDMMYYYY(new Date(currentDate)));
    currentDate += DAY;
  }

  const lastDate = formatDateToDDMMYYYY(new Date(to));

  if (dates[dates.length - 1] !== lastDate) {
    dates.push(lastDate);
  }

  return dates;
}

export function bigIntDiv(numerator: bigint, denominator: bigint, decimals: number = 6): number {
  const decimalsHelper = 10 ** decimals;
  return Number((numerator * BigInt(decimalsHelper)) / denominator) / decimalsHelper;
}
