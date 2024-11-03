import type { DataPoint } from '@/components/chart/chart-utils';
import { Graph } from './graph';
import { TokenPair } from './token-price';

type Pair = {
  baseToken: string;
  quoteToken: string;
};

type Range = {
  from: number;
  to: number;
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

  private async load(): Promise<void> {
    for (const pair of PAIRS) {
      this.graph.addEdge(pair.baseToken, pair.quoteToken);
      const tokenPair = new TokenPair(pair.baseToken, pair.quoteToken);
      await tokenPair.loadFromDB();
      this.tokenPrices.set(pairToString(pair), tokenPair);
    }
  }

  static async init(): Promise<TokenPriceManager> {
    const tokenPriceManager = new TokenPriceManager();
    await tokenPriceManager.load();
    return tokenPriceManager;
  }

  // Gets the prices for a pair of tokens
  // If the pair is not found, it tries to find the inverted pair
  private getPairPrices({ pair, range }: { pair: Pair; range: Range }): DataPoint[] | null {
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
      const dataPoints = invertedTokenPair.getPrices(range);

      if (!dataPoints) {
        return null;
      }

      for (const dataPoint of dataPoints) {
        dataPoint.value = 1 / dataPoint.value;
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
      const baseToken = path[i];
      const quoteToken = path[i + 1];

      if (!baseToken || !quoteToken) {
        return null;
      }

      const prices = this.getPairPrices({
        range,
        pair: {
          baseToken,
          quoteToken
        }
      });

      if (!prices) {
        return null;
      }

      for (const point of prices) {
        const dataPoint = result[point.timestamp];

        if (dataPoint === undefined) {
          result[point.timestamp] = point.value;
        } else {
          result[point.timestamp] = dataPoint * point.value;
        }
      }
    }

    return result;
  }
}

export const tokenPriceManager = await TokenPriceManager.init();
