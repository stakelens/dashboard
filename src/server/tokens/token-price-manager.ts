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
      const pair = {
        baseToken: path[i],
        quoteToken: path[i + 1]
      };

      let tokenPair = this.tokenPrices.get(pairToString(pair));

      let inverted = false;

      if (!tokenPair) {
        inverted = true;

        const pair = {
          baseToken: path[i + 1],
          quoteToken: path[i]
        };

        tokenPair = this.tokenPrices.get(pairToString(pair));

        if (!tokenPair) {
          return null;
        }
      }

      const prices = await tokenPair.getPrices(range);

      if (!prices) {
        return null;
      }

      for (const point of prices) {
        const timestamp = point.timestamp;

        let price = point.price;

        if (inverted) {
          price = 1 / price;
        }

        if (result[timestamp] === undefined) {
          result[timestamp] = price;
        } else {
          result[timestamp] = result[timestamp] * price;
        }
      }
    }

    return result;
  }
}

export const tokenPriceManager = await TokenPriceManager.init();
