import { Graph } from './graph';
import { TokenPair } from './token-price';

type Pair = {
  baseToken: string;
  quoteToken: string;
};

function pairToString(pair: Pair) {
  return `${pair.baseToken}-${pair.quoteToken}`;
}

const PAIRS: Pair[] = [
  {
    baseToken: 'RPL',
    quoteToken: 'WETH'
  },
  {
    baseToken: 'WETH',
    quoteToken: 'USDC'
  }
];

class TokenPriceManager {
  private graph: Graph = new Graph();
  private tokenPrices: Map<string, TokenPair> = new Map();

  private constructor() {}

  private async load() {
    for (const pair of PAIRS) {
      this.graph.addEdge(pair.baseToken, pair.quoteToken);
      const tokenPair = new TokenPair(pair.baseToken, pair.quoteToken);
      await tokenPair.loadFromDB();
      this.tokenPrices.set(pairToString(pair), tokenPair);
    }
  }

  static async init() {
    const tokenPriceManager = new TokenPriceManager();
    await tokenPriceManager.load();
    return tokenPriceManager;
  }

  // Gets the prices for a pair of tokens
  // If the pair is not found, it tries to find the inverted pair
  private getPairPrices({
    pair,
    range
  }: {
    pair: Pair;
    range: {
      from: number;
      to: number;
    };
  }):
    | {
        timestamp: number;
        price: number;
      }[]
    | null {
    const tokenPair = this.tokenPrices.get(pairToString(pair));

    if (tokenPair) {
      return tokenPair.getPrices(range);
    }

    const invertedPair = {
      baseToken: pair.quoteToken,
      quoteToken: pair.baseToken
    };

    const invertedTokenPair = this.tokenPrices.get(pairToString(invertedPair));

    if (invertedTokenPair) {
      const prices = invertedTokenPair.getPrices(range);

      if (!prices) {
        return null;
      }

      for (let i = 0; i < prices.length; i++) {
        prices[i].price = 1 / prices[i].price;
      }
    }

    return null;
  }

  async getPrices({
    pair,
    range
  }: {
    pair: Pair;
    range: {
      from: number;
      to: number;
    };
  }): Promise<Record<number, number> | null> {
    const path = this.graph.shortestPath(pair.baseToken, pair.quoteToken);

    if (!path) {
      return null;
    }

    const result: Record<number, number> = {};

    for (let i = 0; i < path.length - 1; i++) {
      const prices = this.getPairPrices({
        range,
        pair: {
          baseToken: path[i],
          quoteToken: path[i + 1]
        }
      });

      if (!prices) {
        return null;
      }

      for (const point of prices) {
        if (result[point.timestamp] === undefined) {
          result[point.timestamp] = point.price;
        } else {
          result[point.timestamp] = result[point.timestamp] * point.price;
        }
      }
    }

    return result;
  }
}

export const tokenPriceManager = await TokenPriceManager.init();
