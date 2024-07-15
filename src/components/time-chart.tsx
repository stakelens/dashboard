import { formatDateToDDMMYYYY as formatDate } from '@/lib/utils';
import type { TooltipProps } from 'recharts';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { MONTHS } from './time-constants';
import { numberFormater } from '@/format';

type DataPoint = {
  timestamp: number;
  value: number;
};

export function TimeChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="mt-4 md:mt-8 rounded relative">
      <WaterMark />

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
              tickFormatter={numberFormater}
            />
            <Tooltip
              content={(data: TooltipProps<number, number>) => (
                <div className="bg-[#191919] border border-white border-opacity-10 rounded p-4 text-xs font-mono text-white">
                  <p className="mb-2">
                    {data.payload &&
                      data.payload.length > 0 &&
                      formatDate(new Date(data.payload[0].payload.timestamp))}
                  </p>
                  {data.payload && data.payload.length > 0 && data.payload[0].value !== undefined
                    ? numberFormater(data.payload[0].value)
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
              data={data}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function WaterMark() {
  return (
    <div className="absolute pointer-events-none bottom-12 right-8 opacity-50">
      <div className="flex items-center justify-center gap-2">
        <img src="/aperture.png" alt="aperture" className="w-6 h-6" />
        <div className="text-2xl font-medium font-mono">Stakelens</div>
      </div>
    </div>
  );
}
