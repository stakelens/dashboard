import { db } from '@/db';
import { delay, fetchWithRetry, formatDateToDDMMYYYY as formatDate } from '@/lib/utils';

export class TokenPriceManager {
  private requestsPerMinute: number = 25;
  private tokens: Map<string, Map<string, number>> = new Map();

  async getTokenPrices(token: string, dates: Date[]): Promise<Record<string, number>> {
    const prices: Record<string, number> = {};
    const uniqueDates = [...new Set(dates.map((date) => formatDate(new Date(date))))];

    const records = await db.currencyPrice.findMany({
      where: {
        name: token,
        date: { in: uniqueDates }
      }
    });

    let tokenPrices = this.getToken(token);

    for (const record of records) {
      tokenPrices.set(record.date, record.price);
      prices[record.date] = record.price;
    }

    const datesToFetch = uniqueDates.filter((date) => !prices[date]);

    for (let i = 0; i < datesToFetch.length; i += this.requestsPerMinute) {
      const dates = datesToFetch.slice(i, i + this.requestsPerMinute);

      await Promise.all(
        dates.map(async (date) => {
          const price = await this.fetchPrice(token, date);
          tokenPrices.set(date, price);
          prices[date] = price;
        })
      );

      await delay(60 * 1000);
    }

    return prices;
  }

  private async fetchPrice(token: string, date: string): Promise<number> {
    const response = await fetchWithRetry({
      url: `https://api.coingecko.com/api/v3/coins/${token}/history?date=${date}&localization=false`,
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-api-key': import.meta.env.PUBLIC_COIN_GECKO
      }
    });

    let price = response.market_data.current_price.usd;
    this.savePrice(token, date, price);
    return price;
  }

  private async savePrice(token: string, date: string, price: number): Promise<void> {
    await db.currencyPrice.upsert({
      create: {
        name: token,
        price: price,
        date: date
      },
      update: {
        name: token,
        price: price
      },
      where: {
        name_date: {
          name: token,
          date: date
        }
      }
    });
  }

  private getToken(token: string): Map<string, number> {
    if (!this.tokens.has(token)) {
      this.tokens.set(token, new Map());
    }

    return this.tokens.get(token)!;
  }
}
