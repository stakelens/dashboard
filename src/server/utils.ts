import { DAY } from './time-constants';

export function closestDay(timestamp: number): number {
  return Math.floor(timestamp / DAY) * DAY;
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
