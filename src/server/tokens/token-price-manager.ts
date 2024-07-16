import { TOKENS } from './tokens';
import { TokenPrices } from './token-price';

class TokenPriceManager {
  private tokenPrices: Record<string, TokenPrices> = {};

  constructor() {
    this.load();
  }

  private async load() {
    for (const [token, config] of Object.entries(TOKENS)) {
      const tokenPrices = new TokenPrices(config);
      await tokenPrices.waitForAllPrices();
      this.tokenPrices[token] = tokenPrices;
    }
  }

  async getPrices({
    token,
    range
  }: {
    token: string;
    range: {
      from: number;
      to: number;
    };
  }): Promise<Record<string, number> | null> {
    const tokenPrices = this.tokenPrices[token];

    if (!tokenPrices) {
      return null;
    }

    return await tokenPrices.getPrices(range);
  }
}

export const tokenPriceManager = new TokenPriceManager();
