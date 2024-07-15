export type TokenConfig = {
  coingeckoLabel: string;
  startDate: number;
};

export const TOKENS = {
  ethereum: {
    coingeckoLabel: 'ethereum',
    startDate: 123
  },
  rocketPool: {
    coingeckoLabel: 'rocket-pool',
    startDate: 1235
  }
} satisfies Record<string, TokenConfig>;
