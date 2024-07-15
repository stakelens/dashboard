import { numberFormater } from '@/format';
import { formatDateToDDMMYYYY as formatDate } from '@/lib/utils';
import { combineTVLs, type TVL } from '@/tvl';
import { useEffect, useState, type ReactNode } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  type TooltipProps
} from 'recharts';
import { DAY, MONTH, MONTHS, WEEK, YEAR } from './time-constants';

const valueToLabel: Record<
  number,
  {
    long: string;
    short: string;
  }
> = {
  [DAY]: {
    long: '1 day',
    short: '24H'
  },
  [WEEK]: {
    long: '7 days',
    short: '7D'
  },
  [MONTH]: {
    long: '1 month',
    short: '1M'
  },
  [3 * MONTH]: {
    long: '3 months',
    short: '3M'
  },
  [YEAR]: {
    long: '1 year',
    short: '1Y'
  },
  [Infinity]: {
    long: 'All time',
    short: 'MAX'
  }
};

function FilterOption({
  filter,
  setFilter,
  value
}: {
  filter: number;
  setFilter: (value: number) => void;
  value: number;
}) {
  return (
    <div
      className={
        filter === value
          ? 'bg-[#2E46C8] rounded border border-white border-opacity-10 px-3 py-1 select-none cursor-pointer'
          : 'bg-[#242424] rounded border border-white border-opacity-10 px-3 py-1 select-none cursor-pointer'
      }
      onClick={() => setFilter(value)}
    >
      {valueToLabel[value].short}
    </div>
  );
}

type EthPrices = Record<string, number>;

export function Change({ positive, children }: { positive: boolean; children: ReactNode }) {
  const color = positive ? '#22c55e' : '#ef4444';

  return (
    <div className="flex items-center justify-end gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="12"
        viewBox="0 0 14 12"
        style={{
          fill: color,
          transform: positive ? 'rotate(0deg)' : 'rotate(180deg)'
        }}
      >
        <path d="M7 0L13.9282 12H0.0717969L7 0Z"></path>
      </svg>
      <div className="font-mono" style={{ color }}>
        {children}
      </div>
    </div>
  );
}

const DATA_CACHE: Map<number, TVL[]> = new Map();

export function Chart({ tvls }: { tvls: TVL[][] }) {
  const [data, setData] = useState<TVL[]>([]);

  const [filter, setFilter] = useState(Infinity);
  const [ethPrices, setEthPrices] = useState<Record<string, number>>({});
  const [isUSD, setIsUSD] = useState(false);
  const [rangeChange, setRangeChange] = useState(0);

  useEffect(() => {
    const tvl = DATA_CACHE.get(filter);

    if (tvl) {
      setData(filterLastYear(tvl));
    } else {
      const allTimestamps = tvls.map((tvl) => tvl.map((value) => value.timestamp)).flat();

      const now = Date.now();

      const tvl = combineTVLs({
        tvls,
        divisions: 1000,
        max: now,
        min: filter === Infinity ? Math.min(...allTimestamps) : now - filter
      });

      DATA_CACHE.set(filter, tvl);
      setData(filterLastYear(tvl));
    }
  }, [filter]);

  useEffect(() => {
    const fetchPrices = async () => {
      const uniqueDates = [...new Set(data.map((point) => new Date(point.timestamp)))];
      const response = await fetch('/api/token-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: 'ethereum',
          dates: uniqueDates
        })
      });
      const { prices } = await response.json();
      setEthPrices(prices);
    };

    if (data.length > 0) {
      fetchPrices();
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 1) {
      const lastValue = data[data.length - 1].value;
      const firstValue = data[0].value;

      const percentChange = (100 * (lastValue + firstValue)) / firstValue;

      setRangeChange(percentChange);
    } else {
      setRangeChange(0);
    }
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      const lastPoint = data[data.length - 1];
      const usdValue = convertETHToUSD(lastPoint.value, lastPoint.timestamp, ethPrices, true);
      console.log('Last data point:', {
        timestamp: formatDate(new Date(lastPoint.timestamp)),
        ethValue: lastPoint.value,
        ethPrice: ethPrices[formatDate(new Date(lastPoint.timestamp))],
        usdValue: usdValue
      });
    }
  }, [data, ethPrices]);

  if (data.length === 0) {
    return null;
  }

  const formatValue = (value: number): string => {
    return numberFormater(value);
  };

  return (
    <div className="mt-16 md:mt-24 mb-16">
      <div className="flex items-center justify-between gap-4 md:gap-8 flex-wrap">
        <div>
          <h2 className="text-2xl md:text-3xl font-medium mb-2">Liquid Staking</h2>
          <div className="text-lg md:text-xl opacity-70 max-w-[600px] font-light">
            Total ETH value of all liquid staking protocol assets.
          </div>
        </div>
        <div className="min-w-[120px] text-right w-full lg:w-auto">
          <div className="text-[40px] md:leading-[50px] font-medium">
            {isUSD ? '$' : ''}
            {numberFormater(
              Number(data[data.length - 1].value) *
                (isUSD ? ethPrices[formatDate(new Date(data[data.length - 1].timestamp))] || 1 : 1)
            )}{' '}
            {isUSD ? '' : 'ETH'}
          </div>
          <Change positive={rangeChange >= 0}>
            <span>
              {Intl.NumberFormat('en-US', {
                maximumFractionDigits: 2
              }).format(rangeChange)}
              %
            </span>
            <span className="text-white">
              <span className="opacity-60"> /</span> {valueToLabel[filter].long}
            </span>
          </Change>
        </div>
      </div>
      <div className="mt-4 md:mt-8 rounded relative">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex items-center justify-center font-mono text-xs md:text-sm gap-2 lg:gap-3 font-bold">
            <div
              className="rounded border border-white border-opacity-10 px-3 py-1 select-none cursor-pointer"
              style={{
                backgroundColor: isUSD ? '#2E46C8' : '#242424'
              }}
              onClick={() => setIsUSD(true)}
            >
              USD
            </div>
            <div
              className="rounded border border-white border-opacity-10 px-3 py-1 select-none cursor-pointer"
              style={{
                backgroundColor: !isUSD ? '#2E46C8' : '#242424'
              }}
              onClick={() => setIsUSD(false)}
            >
              ETH
            </div>
          </div>
          <div className="flex items-center justify-end font-mono font-bold text-xs md:text-sm gap-2 lg:gap-3 flex-wrap">
            <FilterOption setFilter={setFilter} filter={filter} value={DAY} />
            <FilterOption setFilter={setFilter} filter={filter} value={WEEK} />
            <FilterOption setFilter={setFilter} filter={filter} value={MONTH} />
            <FilterOption setFilter={setFilter} filter={filter} value={3 * MONTH} />
            <FilterOption setFilter={setFilter} filter={filter} value={YEAR} />
            <FilterOption setFilter={setFilter} filter={filter} value={Infinity} />
          </div>
        </div>
        <div className="w-full h-full">
          <ResponsiveContainer width={'100%'} height={330} style={{ padding: 4 }}>
            <AreaChart data={data}>
              <CartesianGrid vertical={false} horizontal={true} stroke="#ffffff11" />
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                tickLine={false}
                axisLine={false}
                className="font-mono text-xs"
                dataKey="timestamp"
                stroke={'#6b7280'}
                minTickGap={100}
                tickFormatter={(timestamp) => {
                  const date = new Date(timestamp);
                  return MONTHS[date.getMonth()] + ' ' + date.getDate();
                }}
              />
              <YAxis
                tickLine={false}
                className="font-mono text-xs"
                axisLine={false}
                stroke={'#6b7280'}
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value: number) => {
                  return formatValue(value);
                }}
              />
              <Tooltip
                content={(data: TooltipProps<number, number>) => (
                  <div className="bg-[#191919] border border-white border-opacity-10 rounded p-4 text-xs font-mono text-white">
                    <p className="mb-2">
                      {data.payload &&
                        data.payload.length > 0 &&
                        formatDate(new Date(data.payload[0].payload.timestamp))}
                    </p>
                    <span className="opacity-50 mr-2">{isUSD ? 'USD: ' : 'ETH: '}</span>
                    {data.payload && data.payload.length > 0 && data.payload[0].value !== undefined
                      ? formatValue(data.payload[0].value)
                      : ''}
                  </div>
                )}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUv)"
                activeDot={{
                  fill: '#3b82f6',
                  stroke: '#FFFFFF88',
                  strokeWidth: 1
                }}
                isAnimationActive={false}
                data={data.map((point) => ({
                  ...point,
                  value: convertETHToUSD(point.value, point.timestamp, ethPrices, isUSD)
                }))}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="absolute pointer-events-none bottom-12 right-8 opacity-50">
          <div className="flex items-center justify-center gap-2">
            <img src="/aperture.png" alt="aperture" className="w-6 h-6" />
            <div className="text-2xl font-medium font-mono">Stakelens</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function filterLastYear(data: TVL[]): TVL[] {
  const oneYearAgo = Date.now() - YEAR;
  return data.filter((point) => point.timestamp >= oneYearAgo);
}

const convertETHToUSD = (
  value: number,
  timestamp: number,
  ethPrices: EthPrices,
  isUSD: boolean
): number => {
  if (!isUSD) return value;
  const price = ethPrices[formatDate(new Date(timestamp))];
  if (typeof price !== 'number') {
    console.warn(`No ETH price found for date: ${formatDate(new Date(timestamp))}`);
    return value;
  }
  return value * price;
};
