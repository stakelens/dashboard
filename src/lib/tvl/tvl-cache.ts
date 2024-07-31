import { YEAR } from '@/lib/time-constants';
import { combineTVLs } from '@/lib/tvl/tvl-utils';
import { getAllTVLs } from '@/lib/tvl/tvls';
import type { DataPoint } from '../chart-utils';

const REFRESH_PERIOD = 60 * 1000;

let refreshInterval: number | undefined;
let lastTvlValue: {
  tvls: Awaited<ReturnType<typeof getAllTVLs>>;
  chartData: DataPoint[][];
  combinedTVL: DataPoint[];
} | null = null;

export async function getAllTVLsWithCache() {
  if (refreshInterval === undefined) {
    refreshInterval = setInterval(async () => {
      lastTvlValue = await getTvl();
    }, REFRESH_PERIOD);
  }

  if (lastTvlValue) {
    return lastTvlValue;
  }

  lastTvlValue = await getTvl();
  return lastTvlValue;
}

async function getTvl() {
  const tvls = await getAllTVLs();

  const chartData = Object.values(tvls).map((tvl) =>
    tvl.map((x) => ({
      timestamp: x.timestamp,
      value: x.eth
    }))
  );

  const combinedTVL = combineTVLs({
    tvls: chartData,
    divisions: 365,
    max: Date.now(),
    min: Date.now() - YEAR
  });

  return {
    tvls,
    chartData,
    combinedTVL
  };
}
