import { combineTVLs } from '@/lib/tvl/tvl-utils';
import { numberFormater } from '@/lib/format';
import { ArrowChange } from './arrow-change';
import { USDToggele } from './chart/usd-toggle';
import { useMemo, useRef, useState } from 'react';
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

export function TVLChart({
  title,
  logo,
  description,
  tvls
}: {
  tvls: DataPoint[][];
  title: string;
  logo?: string;
  description: string;
}) {
  const [filter, setFilter] = useState(YEAR);
  const [isUSD, setIsUSD] = useState(false);

  const ethTVL = useCombineTVL(tvls, filter);
  const usdTVL = convertETHChartToUSD(ethTVL, filter);

  const TVL = useMemo(() => (isUSD ? usdTVL : ethTVL), [isUSD, usdTVL, ethTVL]);

  return (
    <div className="relative">
      {isUSD && usdTVL.length == 0 && <LoadingOverlay />}
      <TVLHeader
        title={title}
        logo={logo}
        description={description}
        changeRange={FILTER_TO_LABEL[filter].long}
        isUSD={isUSD}
        data={TVL}
      />
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

function LoadingOverlay() {
  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      Loading...
    </div>
  );
}

function TVLHeader({
  title,
  logo,
  description,
  data,
  changeRange,
  isUSD
}: {
  title: string;
  description: string;
  logo?: string;
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
        <div className="flex items-center justify-start gap-2 mb-2">
          {logo && <img src={logo} className="w-8 h-8" />}
          <h2 className="text-2xl font-medium md:text-3xl">{title}</h2>
        </div>
        <div className="text-lg md:text-xl opacity-70 max-w-[600px] font-light">{description}</div>
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
