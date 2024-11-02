import { YEAR } from '@/lib/time-constants';
import { getAllTVLs } from '@/lib/tvl/tvls';
import { combineDataPoints, type DataPoint } from '../chart-utils';

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

  const combinedTVL = combineDataPoints({
    dataPointsArray: chartData,
    numberOfSegments: 365,
    endTimestamp: Date.now(),
    startTimestamp: Date.now() - YEAR
  });

  return {
    tvls,
    chartData,
    combinedTVL
  };
}
