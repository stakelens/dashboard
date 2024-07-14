import { db } from '@/db';
import { formatDateToDDMMYYYY as formatDate } from '@/lib/utils';

type CoinGeckoPriceResponse = {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: {
      usd: number;
    };
  };
};

export class TokenPriceManager {
  private ratePerMinute: number = 25;
  private httpOptions = {
    method: 'GET',
    headers: { accept: 'application/json', 'x-cg-api-key': import.meta.env.PUBLIC_COIN_GECKO }
  };
  private tokenPricesByDate: Map<string, Map<string, number>> = new Map();

  async fetchTokenPrices(token: string, dates: Date[]): Promise<Record<string, number>> {
    const prices: Record<string, number> = {};
    const uniqueDates = [...new Set(dates.map((date) => formatDate(new Date(date))))];

    const dbRecords = await db.currencyPrice.findMany({
      where: {
        name: token,
        date: { in: uniqueDates }
      }
    });

    for (const record of dbRecords) {
      if (!this.tokenPricesByDate.has(token)) {
        this.tokenPricesByDate.set(token, new Map());
      }
      this.tokenPricesByDate.get(token)!.set(record.date, record.price);
      prices[record.date] = record.price;
    }

    const datesToFetch = uniqueDates.filter((date) => !prices[date]);

    for (let i = 0; i < datesToFetch.length; i += this.ratePerMinute) {
      const batch = datesToFetch.slice(i, i + this.ratePerMinute);
      const batchPromises = batch.map((dateStr) =>
        this.fetchAndUpdatePrice(token, dateStr, prices)
      );

      await Promise.all(batchPromises);

      if (i + this.ratePerMinute < datesToFetch.length) {
        await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
      }
    }

    return prices;
  }

  private async fetchAndUpdatePrice(
    token: string,
    dateStr: string,
    prices: Record<string, number>
  ): Promise<void> {
    try {
      const price = await this.fetchSinglePrice(token, dateStr);
      await this.updateCacheAndDatabase(token, dateStr, price);
      prices[dateStr] = price;
    } catch (error) {
      console.error(`Failed to fetch price for ${token} on ${dateStr}:`, error);
    }
  }

  private async updateCacheAndDatabase(
    token: string,
    dateStr: string,
    price: number
  ): Promise<void> {
    if (!this.tokenPricesByDate.has(token)) {
      this.tokenPricesByDate.set(token, new Map());
    }
    this.tokenPricesByDate.get(token)!.set(dateStr, price);

    try {
      await db.currencyPrice.upsert({
        create: {
          name: token,
          price: price,
          date: dateStr
        },
        update: {
          name: token,
          price: price
        },
        where: {
          name_date: {
            name: token,
            date: dateStr
          }
        }
      });
      console.log(`Successfully updated DB for ${token} on ${dateStr}`);
    } catch (error) {
      console.error(`Failed to update DB for ${token} on ${dateStr}:`, error);
    }
  }

  private async fetchSinglePrice(token: string, dateStr: string, retries = 3): Promise<number> {
    const url = `https://api.coingecko.com/api/v3/coins/${token}/history?date=${dateStr}&localization=false`;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        console.log('Attempting to fetch price from CoinGecko');
        const response = await fetch(url, this.httpOptions);
        if (!response.ok) {
          if (response.status === 429 && attempt < retries - 1) {
            console.log('CoinGecko rate limit reached, waiting for 60 seconds');
            await new Promise((resolve) => setTimeout(resolve, 60000));
            continue;
          }

          throw new Error(
            `HTTP error! status: ${response.status}, Error: ${response.statusText}, URL: ${url}`
          );
        }
        const data = (await response.json()) as CoinGeckoPriceResponse;
        console.log(`Successfully fetched price from CoinGecko for ${token} on ${dateStr}`);
        console.log(data);
        return data.market_data.current_price.usd;
      } catch (error) {
        if (attempt === retries - 1) throw error;

        console.log('Retrying fetch price from CoinGecko');
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
    throw new Error('Max retries reached');
  }
}
