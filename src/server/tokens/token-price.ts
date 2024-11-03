import { db } from '@/server/db';
import { DAY } from '@/server/time-constants';
import { average, closestDay } from '@/server/utils';
import type { DataPoint } from '@/components/chart-utils';

export class TokenPair {
  readonly baseToken: string;
  readonly quoteToken: string;
  readonly refetchInterval: number = 1000 * 60 * 5;
  private prices: Map<number, number> = new Map();

  constructor(baseToken: string, quoteToken: string) {
    this.baseToken = baseToken;
    this.quoteToken = quoteToken;
    setInterval(() => this.loadFromDB(), this.refetchInterval);
  }

  getPrices({ from, to }: { from: number; to: number }): DataPoint[] | null {
    const result: DataPoint[] = [];

    for (let day = closestDay(from); day <= to; day += DAY) {
      const price = this.prices.get(day);

      if (price !== undefined) {
        result.push({ timestamp: day, value: price });
        continue;
      }

      const lastValue = result[result.length - 1];

      if (lastValue) {
        result.push({ timestamp: day, value: lastValue.value });
        continue;
      }

      result.push({ timestamp: day, value: 0 });
    }

    return result;
  }

  async loadFromDB() {
    const records = await db.uniswapTWAP.findMany({
      where: {
        quote_token: this.quoteToken,
        base_token: this.baseToken
      },
      orderBy: {
        block_timestamp: 'asc'
      }
    });

    const valuesPerDay: Map<number, number[]> = new Map();

    for (const record of records) {
      const day = closestDay(Number(record.block_timestamp) * 1000);
      const valuesOfDay = valuesPerDay.get(day);

      if (!valuesOfDay) {
        valuesPerDay.set(day, [record.price]);
      } else {
        valuesOfDay.push(record.price);
      }
    }

    for (const [key, value] of valuesPerDay) {
      this.prices.set(key, average(value));
    }
  }
}
