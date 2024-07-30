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

export function bigIntDiv(numerator: bigint, denominator: bigint, decimals: number = 6): number {
  const decimalsHelper = 10 ** decimals;
  return Number((numerator * BigInt(decimalsHelper)) / denominator) / decimalsHelper;
}

export function getDateText(givenDate: Date | string) {
  if (typeof givenDate === 'string') {
    givenDate = new Date(givenDate);
  }

  const diff = (Date.now() - givenDate.getTime()) / 1000;

  if (diff < 60) {
    return `a few seconds ago`;
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} minutes ago`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (Math.floor(diff / 86400) === 1) {
    return `yesterday`;
  } else if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (
    givenDate.getFullYear() === new Date().getFullYear() &&
    givenDate.getMonth() === new Date().getMonth()
  ) {
    return givenDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  } else {
    return givenDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}

export function average(values: number[]): number {
  let sum = 0;

  for (let i = 0; i < values.length; i++) {
    sum += values[i];
  }

  return sum / values.length;
}
