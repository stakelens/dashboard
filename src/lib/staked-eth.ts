import { db } from '@/server/db';
import { bigIntDiv, closestDay } from './utils';
import { combineDataPoints, type DataPoint } from './chart-utils';
import { DAY, YEAR } from './time-constants';

export async function getStakedETH(): Promise<DataPoint[]> {
  const data = (
    await db.beaconDeposit.findMany({
      orderBy: {
        block_number: 'asc'
      }
    })
  ).map((value) => {
    return {
      value: bigIntDiv(BigInt(value.eth), BigInt(1e18)),
      timestamp: Number(value.block_timestamp) * 1_000
    };
  });

  return combineDataPoints({
    dataPointsArray: [data],
    stepSize: DAY,
    endTimestamp: closestDay(Date.now()),
    startTimestamp: closestDay(Date.now() - YEAR)
  });
}
