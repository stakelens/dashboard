import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DAY } from './time-constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function closestDay(timestamp: number): number {
  return Math.floor(timestamp / DAY) * DAY;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function bigIntDiv(numerator: bigint, denominator: bigint, decimals: number = 6): number {
  const decimalsHelper = 10 ** decimals;
  return Number((numerator * BigInt(decimalsHelper)) / denominator) / decimalsHelper;
}

export function average(values: number[]): number {
  let sum = 0;

  for (const value of values) {
    sum += value;
  }

  return sum / values.length;
}
