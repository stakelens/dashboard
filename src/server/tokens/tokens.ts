export type TokenConfig = {
  coingeckoLabel: string;
  startDate: number;
};

export const TOKENS = {
  ethereum: {
    coingeckoLabel: 'ethereum',
    startDate: 1689537821430
  },
  rocketPool: {
    coingeckoLabel: 'rocket-pool',
    startDate: 1689537821430
  }
} satisfies Record<string, TokenConfig>;
