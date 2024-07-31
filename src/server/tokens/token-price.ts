import { db } from '@/server/db';
import { DAY } from '@/lib/time-constants';
import { average } from '@/lib/utils';

function closestDay(timestamp: number): number {
  return Math.floor(timestamp / DAY) * DAY;
}

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

  getPrices({
    from,
    to
  }: {
    from: number;
    to: number;
  }): { timestamp: number; price: number }[] | null {
    const result: { timestamp: number; price: number }[] = [];
    let lastValidPrice: number | undefined;

    for (let day = closestDay(from); day <= to; day += DAY) {
      const price = this.prices.get(day);

      if (price !== undefined) {
        result.push({ timestamp: day, price: price });
        lastValidPrice = price;
      } else if (lastValidPrice !== undefined) {
        result.push({ timestamp: day, price: lastValidPrice });
      } else {
        return [];
      }
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
