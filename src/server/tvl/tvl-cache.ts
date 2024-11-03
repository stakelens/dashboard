import { closestDay } from '@/server/utils';
import { getAllTVLs } from '@/server/tvl/tvls';
import { DAY, YEAR } from '@/server/time-constants';
import {
  alignDataPointsTimestamps,
  combineDataPoints,
  type DataPoint
} from '@/components/chart/chart-utils';

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

  const alignedData = chartData.map((data) =>
    alignDataPointsTimestamps({
      data,
      stepSize: DAY,
      endTimestamp: closestDay(Date.now()),
      startTimestamp: closestDay(Date.now() - YEAR)
    })
  );

  const combinedTVL = combineDataPoints(alignedData);

  return {
    tvls,
    chartData,
    combinedTVL
  };
}
