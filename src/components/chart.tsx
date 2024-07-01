import { useEffect, useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const DAY = 1000 * 60 * 60 * 24;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 12 * MONTH;

function FilterOption({
  filter,
  setFilter,
  value,
  label
}: {
  filter: number;
  setFilter: (value: number) => void;
  value: number;
  label: string;
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
      {label}
    </div>
  );
}

export function Chart({
  data
}: {
  data: {
    date: String;
    ETH: number;
    timestamp: number;
  }[];
}) {
  const [filter, setFilter] = useState(Infinity);
  const [onMobile, setOnMobile] = useState(false);
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const now = Date.now();
    const filteredData = data.filter((x) => now - x.timestamp < filter);
    setFilteredData(filteredData);
  }, [filter]);

  const handleResize = () => {
    setOnMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="mt-4 md:mt-8 rounded mb-16">
      <div className="flex items-center justify-end font-mono text-sm font-bold gap-3 mb-8">
        <FilterOption setFilter={setFilter} filter={filter} value={Infinity} label="MAX" />
        <FilterOption setFilter={setFilter} filter={filter} value={YEAR} label="1Y" />
        <FilterOption setFilter={setFilter} filter={filter} value={3 * MONTH} label="3M" />
        <FilterOption setFilter={setFilter} filter={filter} value={MONTH} label="1M" />
        <FilterOption setFilter={setFilter} filter={filter} value={WEEK} label="7D" />
        <FilterOption setFilter={setFilter} filter={filter} value={DAY} label="24H" />
      </div>
      <div className="w-full h-full">
        <ResponsiveContainer width={'100%'} height={330} style={{ padding: 4 }}>
          <AreaChart data={filteredData}>
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
              dataKey="date"
              stroke={'#6b7280'}
              minTickGap={100}
            />
            <YAxis
              tickLine={false}
              className="font-mono text-xs"
              axisLine={false}
              stroke={'#6b7280'}
              domain={['dataMin', 'dataMax']}
            />
            <Tooltip
              content={(data) => (
                <div className="bg-[#191919] border border-white border-opacity-10 rounded p-4 text-xs font-mono">
                  <p className="mb-2">
                    {data.payload && data.payload.length ? data.payload[0].payload.date : ''}
                  </p>
                  <span className="opacity-50 mr-6">
                    {data.payload && data.payload.length ? data.payload[0].dataKey + ':' : ''}
                  </span>
                  {data.payload && data.payload.length
                    ? Intl.NumberFormat('us')
                        .format(Math.round(Number(data.payload[0].value)))
                        .toString()
                    : ''}
                </div>
              )}
            ></Tooltip>
            <Area
              type="monotone"
              dataKey="ETH"
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
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div />
    </div>
  );
}
