import { numberFormater } from '@/format';
import { combineTVLs } from '@/tvl';
import { useEffect, useMemo, useState } from 'react';
import { Filter, FILTER_TO_LABEL } from './chart/filter';
import { ArrowChange } from './arrow-change';
import { TimeChart, type DataPoint } from './chart/time-chart';
import { USDToggele } from './chart/usd-toggle';

export function TVLChat({ tvls }: { tvls: DataPoint[][] }) {
  const [filter, setFilter] = useState(Infinity);
  const [isUSD, setIsUSD] = useState(false);

  const data = useMemo(
    () =>
      combineTVLs({
        tvls,
        divisions: 1000,
        max: Date.now(),
        min: Date.now() - filter
      }),
    [filter]
  );

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 md:mt-24 mb-16">
      <TVLHeader data={data} filter={filter} />
      <div className="mt-4 md:mt-8 relative">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <USDToggele isUSD={isUSD} setIsUSD={setIsUSD} />
          <Filter filter={filter} setFilter={setFilter} />
        </div>
        <TimeChart data={data} />
      </div>
    </div>
  );
}

function percentChange(chartData: DataPoint[]) {
  const lastValue = chartData[chartData.length - 1].value;
  const firstValue = chartData[0].value;
  return (100 * (lastValue + firstValue)) / firstValue;
}

function TVLHeader({ data, filter }: { data: DataPoint[]; filter: number }) {
  const [rangeChange, setRangeChange] = useState(0);
  useEffect(() => setRangeChange(percentChange(data)), [data]);

  return (
    <div className="flex items-center justify-between gap-4 md:gap-8 flex-wrap">
      <div>
        <h2 className="text-2xl md:text-3xl font-medium mb-2">Liquid Staking</h2>
        <div className="text-lg md:text-xl opacity-70 max-w-[600px] font-light">
          Total ETH value of all liquid staking protocol assets.
        </div>
      </div>
      <div className="min-w-[120px] text-right w-full lg:w-auto">
        <div className="text-[40px] md:leading-[50px] font-medium">
          {numberFormater(Number(data[data.length - 1].value))} ETH
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
