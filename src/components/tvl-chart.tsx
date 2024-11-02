import { USDToggele } from './chart/usd-toggle';
import { useMemo, useRef, useState } from 'react';
import { Filter, FILTERS } from './chart/filter';
import { TimeChart } from './chart/time-chart';
import { useETHPrice } from '@/lib/eth-prices';
import { DAY } from '@/lib/time-constants';
import { combineDataPoints, convertChartDenomination, type DataPoint } from '@/lib/chart-utils';
import { closestDay } from '@/lib/utils';
import { CopyToClipboard } from './copy-to-clipboard';
import { LastUpdated } from './last-update';
import { TVLHeader } from './tvl-header';

function useCombineTVL(
  data: DataPoint[][],
  filter: number,
  defaultValue?: DataPoint[]
): DataPoint[] {
  const cache = useRef<Record<number, DataPoint[]>>(
    defaultValue
      ? {
          [filter]: defaultValue
        }
      : {}
  );

  return useMemo<DataPoint[]>(() => {
    if (cache.current[filter]) {
      return cache.current[filter]!;
    }

    cache.current[filter] = combineDataPoints({
      dataPointsArray: data,
      stepSize: DAY,
      endTimestamp: closestDay(Date.now()),
      startTimestamp: closestDay(Date.now() - filter)
    });

    return cache.current[filter]!;
  }, [data, filter]);
}

function convertETHChartToUSD(data: DataPoint[], key: number) {
  const ethPrice = useETHPrice();
  const usdCache = useRef<Record<number, DataPoint[]>>({});

  return useMemo<DataPoint[]>(() => {
    if (!ethPrice) {
      return [];
    }

    if (usdCache.current[key]) {
      return usdCache.current[key]!;
    }

    usdCache.current[key] = convertChartDenomination({
      data,
      conversionTable: ethPrice
    });

    return usdCache.current[key]!;
  }, [data, key, ethPrice]);
}

export function TVLChart({
  title,
  logo,
  description,
  tvls,
  defaultValue
}: {
  defaultValue?: DataPoint[];
  tvls: DataPoint[][];
  title: string;
  logo?: string;
  description: string;
}) {
  const [filter, setFilter] = useState<Filter>('year');
  const [isUSD, setIsUSD] = useState(false);
  const timestamp = getLastTimestamp(tvls);

  const ethTVL = useCombineTVL(tvls, FILTERS[filter].value, defaultValue);
  const usdTVL = convertETHChartToUSD(ethTVL, FILTERS[filter].value);

  const TVL: DataPoint[] = useMemo<DataPoint[]>(() => {
    if (isUSD) {
      return usdTVL;
    }

    return ethTVL;
  }, [isUSD, usdTVL, ethTVL]);

  return (
    <div
      className="relative bg-[#111] p-8 rounded border border-white border-opacity-10"
      id="home-tvl"
    >
      {isUSD && usdTVL.length == 0 && <LoadingOverlay />}
      <TVLHeader
        title={title}
        logo={logo}
        description={description}
        changeRange={FILTERS[filter].long}
        isUSD={isUSD}
        data={TVL}
      />
      <div className="mt-4 md:mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <USDToggele isUSD={isUSD} setIsUSD={setIsUSD} />
          <Filter filter={filter} setFilter={setFilter} />
        </div>
        <TimeChart data={TVL} />
        <div className="flex items-center justify-end gap-2">
          <LastUpdated timestamp={timestamp} />
          <CopyToClipboard />
        </div>
      </div>
    </div>
  );
}

/**
 * Get the last timestamp from an array of data points
 * Assumes that each array is sorted by timestamp
 */
function getLastTimestamp(dataPointsArray: DataPoint[][]): number {
  let lastTimestamp = 0;

  for (const dataPoints of dataPointsArray) {
    const value = dataPoints[dataPoints.length - 1];

    if (value && value.timestamp > lastTimestamp) {
      lastTimestamp = value.timestamp;
    }
  }

  return lastTimestamp;
}

function LoadingOverlay() {
  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      Loading...
    </div>
  );
}
