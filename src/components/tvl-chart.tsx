import { combineTVLs } from '@/server/tvl';
import { numberFormater } from '@/lib/format';
import { ArrowChange } from './arrow-change';
import { USDToggele } from './chart/usd-toggle';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Filter, FILTER_TO_LABEL } from './chart/filter';
import { TimeChart } from './chart/time-chart';
import { useETHPrice } from '@/lib/eth-prices';
import { YEAR } from '@/lib/time-constants';
import { convertChartDenomination, percentChange, type DataPoint } from '@/lib/chart-utils';

function useCombineTVL(data: DataPoint[][], filter: number) {
  const cache = useRef<Record<number, DataPoint[]>>({});

  return useMemo(() => {
    if (cache.current[filter]) {
      return cache.current[filter];
    }

    cache.current[filter] = combineTVLs({
      tvls: data,
      divisions: 365,
      max: Date.now(),
      min: Date.now() - filter
    });

    return cache.current[filter];
  }, [data, filter]);
}

function convertETHChartToUSD(data: DataPoint[], key: number) {
  const ethPrice = useETHPrice();
  const usdCache = useRef<Record<number, DataPoint[]>>({});

  return useMemo(() => {
    if (!ethPrice) {
      console.log('ETH PRICE NOT FOUND');
      return [];
    }

    if (usdCache.current[key]) {
      return usdCache.current[key];
    }

    usdCache.current[key] = convertChartDenomination({
      data,
      conversionTable: ethPrice
    });

    return usdCache.current[key];
  }, [data, key, ethPrice]);
}

export function TVLChat({ tvls }: { tvls: DataPoint[][] }) {
  const [filter, setFilter] = useState(YEAR);
  const [isUSD, setIsUSD] = useState(false);

  const ethTVL = useCombineTVL(tvls, filter);
  const usdTVL = convertETHChartToUSD(ethTVL, filter);

  const TVL = useMemo(() => (isUSD ? usdTVL : ethTVL), [isUSD, usdTVL, ethTVL]);

  if (TVL.length === 0) {
    return null;
  }

  return (
    <div className="my-16 md:mt-24">
      <TVLHeader data={TVL} changeRange={FILTER_TO_LABEL[filter].long} isUSD={isUSD} />
      <div className="mt-4 md:mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <USDToggele isUSD={isUSD} setIsUSD={setIsUSD} />
          <Filter filter={filter} setFilter={setFilter} />
        </div>
        <TimeChart data={TVL} />
      </div>
    </div>
  );
}

function TVLHeader({
  data,
  changeRange,
  isUSD
}: {
  data: DataPoint[];
  changeRange: string;
  isUSD: boolean;
}) {
  const rangeChange = percentChange(data);
  const lastValue = data[data.length - 1];
  const TVL = lastValue ? numberFormater(lastValue.value) : 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 md:gap-8">
      <div>
        <h2 className="mb-2 text-2xl font-medium md:text-3xl">Liquid Staking</h2>
        <div className="text-lg md:text-xl opacity-70 max-w-[600px] font-light">
          Total ETH value of all liquid staking protocol assets.
        </div>
      </div>
      <div className="min-w-[120px] text-right w-full lg:w-auto">
        <div className="text-[40px] md:leading-[50px] font-medium">
          {isUSD ? `$ ${TVL}` : `${TVL} ETH`}
        </div>
        <ArrowChange positive={rangeChange >= 0}>
          <span>
            {Intl.NumberFormat('en-US', {
              maximumFractionDigits: 2
            }).format(rangeChange)}
            %
          </span>
          <span className="text-white">
            <span className="opacity-60"> /</span> {changeRange}
          </span>
        </ArrowChange>
      </div>
    </div>
  );
}
