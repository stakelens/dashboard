import { YEAR } from '@/lib/time-constants';
import { combineTVLs } from '@/lib/tvl/tvl-utils';
import { getAllTVLs } from '@/lib/tvl/tvls';
import type { DataPoint } from '../chart-utils';

const CACHE_DURATION = 10 * 1000;

let lastFetch = 0;
let lastTvlValue: {
  tvls: Awaited<ReturnType<typeof getAllTVLs>>;
  chartData: DataPoint[][];
  combinedTVL: DataPoint[];
} | null = null;

export async function getAllTVLsWithCache() {
  if (lastTvlValue && Date.now() - lastFetch < CACHE_DURATION) {
    return lastTvlValue;
  }

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

  lastFetch = Date.now();
  lastTvlValue = {
    chartData,
    tvls,
    combinedTVL
  };

  return lastTvlValue;
}
