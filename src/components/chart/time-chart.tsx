import { formatDateToDDMMYYYY as formatDate } from '@/lib/utils';
import type { TooltipProps } from 'recharts';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { MONTHS } from '@/lib/time-constants';
import { numberFormater } from '@/lib/format';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { DataPoint } from '@/lib/chart-utils';

export function TimeChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="relative bg-[#111]" id="tvl-chart">
      <WaterMark />
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
            axisLine={false}
            className="font-mono text-xs"
            stroke={'#6b7280'}
            domain={['dataMin', 'dataMax']}
            tickFormatter={numberFormater}
          />
          <RechartsTooltip content={(data) => <Tooltip data={data} />} />
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
            animationDuration={100}
            data={data}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function Tooltip({ data }: { data: TooltipProps<ValueType, NameType> }) {
  if (!data.payload || data.payload.length == 0 || typeof data.payload[0].value !== 'number') {
    return null;
  }

  const date = formatDate(new Date(data.payload[0].payload.timestamp));
  const value = numberFormater(data.payload[0].value);

  return (
    <div className="bg-[#191919] border border-white border-opacity-10 rounded p-4 font-mono text-xs text-white">
      <p className="mb-2">{date}</p>
      {value}
    </div>
  );
}

function WaterMark() {
  return (
    <div className="absolute opacity-50 pointer-events-none bottom-12 right-8 select-none z-[100]">
      <div className="flex items-center justify-center gap-2">
        <img src="/watermark.svg" alt="watermark" className="w-32" />
      </div>
    </div>
  );
}
