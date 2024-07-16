import { combineTVLs } from '@/server/tvl';
import { numberFormater } from '@/lib/format';
import { ArrowChange } from './arrow-change';
import { USDToggele } from './chart/usd-toggle';
import { useEffect, useMemo, useState } from 'react';
import { Filter, FILTER_TO_LABEL } from './chart/filter';
import { TimeChart, type DataPoint } from './chart/time-chart';
import { useETHPrice } from '@/lib/eth-prices';
import { YEAR } from '@/lib/time-constants';
import { formatDateToDDMMYYYY } from '@/lib/utils';

export function TVLChat({ tvls }: { tvls: DataPoint[][] }) {
  const [filter, setFilter] = useState(YEAR);
  const [isUSD, setIsUSD] = useState(false);
  const ethPrice = useETHPrice();

  const ethTVL = useMemo(
    () =>
      combineTVLs({
        tvls,
        divisions: 1000,
        max: Date.now(),
        min: Date.now() - filter
      }),
    [filter]
  );

  const usdTVL = useMemo(() => {
    if (!ethPrice) {
      return [];
    }

    return ethTVL.map((point) => ({
      timestamp: point.timestamp,
      value: point.value * ethPrice[formatDateToDDMMYYYY(new Date(point.timestamp))]
    }));
  }, [ethTVL, ethPrice]);

  const TVL = useMemo(() => (isUSD ? usdTVL : ethTVL), [isUSD, usdTVL, ethTVL]);

  if (TVL.length === 0) {
    return null;
  }

  return (
    <div className="my-16 md:mt-24">
      <TVLHeader data={TVL} filter={filter} isUSD={isUSD} />
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

function percentChange(chartData: DataPoint[]) {
  const lastValue = chartData[chartData.length - 1].value;
  const firstValue = chartData[0].value;
  return (100 * (lastValue + firstValue)) / firstValue;
}

function TVLHeader({ data, filter, isUSD }: { data: DataPoint[]; filter: number; isUSD: boolean }) {
  const [rangeChange, setRangeChange] = useState(0);
  useEffect(() => setRangeChange(percentChange(data)), [data]);

  const TVL = numberFormater(Number(data[data.length - 1].value));

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
            <span className="opacity-60"> /</span> {FILTER_TO_LABEL[filter].long}
          </span>
        </ArrowChange>
      </div>
    </div>
  );
}
