import { db } from '@/server/db';
import type { TokenConfig } from './tokens';
import { delay, fetchWithRetry, getDatesInRange, ONE_DAY } from '@/lib/utils';

const COINGECKO_RATE_LIMIT = 25;

export class TokenPrices {
  private startDate: number;
  private coingeckoLabel: string;
  private prices: Map<string, number> = new Map();

  constructor(config: TokenConfig) {
    this.startDate = config.startDate;
    this.coingeckoLabel = config.coingeckoLabel;
    this.init();
  }

  async waitForAllPrices() {
    while (true) {
      const dates = this.getDatesWithNoPrice();
      if (dates.length === 0) {
        return;
      }

      await delay(1000);
    }
  }

  async getPrices(params: { from: number; to: number }): Promise<Record<string, number> | null> {
    const dates = getDatesInRange(params);
    const result: Record<string, number> = {};

    for (const date of dates) {
      const price = await this.prices.get(date);

      if (price == undefined) {
        return null;
      }

      result[date] = price;
    }

    return result;
  }

  private async init() {
    await this.loadFromDB();

    while (true) {
      const dates = this.getDatesWithNoPrice();

      if (dates.length == 0) {
        await delay(ONE_DAY);
      }

      for (const date of dates.slice(0, COINGECKO_RATE_LIMIT)) {
        const price = await this.fetchPrice(date);
        await this.savePrice(date, price);
      }
    }
  }

  private async loadFromDB() {
    const records = await db.currencyPrice.findMany({
      where: {
        name: this.coingeckoLabel
      }
    });

    for (const record of records) {
      this.prices.set(record.date, record.price);
    }
  }

  private getDatesWithNoPrice(): string[] {
    const today = Date.now();
    const dates = getDatesInRange({ from: this.startDate, to: today });

    const datesWithNoPrice: string[] = [];

    for (const date of dates) {
      if (!this.prices.has(date)) {
        datesWithNoPrice.push(date);
      }
    }

    return datesWithNoPrice;
  }

  private async fetchPrice(date: string): Promise<number> {
    const response = await fetchWithRetry({
      url: `https://api.coingecko.com/api/v3/coins/${this.coingeckoLabel}/history?date=${date}&localization=false`,
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-api-key': import.meta.env.COIN_GECKO
      }
    });

    return response.market_data.current_price.usd;
  }

  private async savePrice(date: string, price: number) {
    this.prices.set(date, price);

    await db.currencyPrice.upsert({
      create: {
        name: this.coingeckoLabel,
        price: price,
        date: date
      },
      update: {
        name: this.coingeckoLabel,
        price: price
      },
      where: {
        name_date: {
          name: this.coingeckoLabel,
          date: date
        }
      }
    });
  }
}
