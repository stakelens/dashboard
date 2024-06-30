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

export function Chart({
  data
}: {
  data: {
    date: String;
    ETH: number;
  }[];
}) {
  const [onMobile, setOnMobile] = useState(false);

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
        <div className="bg-[#2E46C8] rounded border border-white border-opacity-10 px-3 py-1 select-none cursor-pointer">
          7D
        </div>
        <div className="bg-[#242424] rounded border border-white border-opacity-10 px-3 py-1 select-none cursor-pointer">
          1M
        </div>
        <div className="bg-[#242424] rounded border border-white border-opacity-10 px-3 py-1 select-none cursor-pointer">
          1Y
        </div>
        <div className="bg-[#242424] rounded border border-white border-opacity-10 px-3 py-1 select-none cursor-pointer">
          30D
        </div>
      </div>
      <div className="w-full h-full">
        <ResponsiveContainer width={'100%'} height={330}>
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
              dataKey="date"
              className="font-mono text-xs"
              axisLine={false}
              stroke={'#6b7280'}
            />
            <YAxis
              tickLine={false}
              className="font-mono text-xs"
              axisLine={false}
              stroke={'#6b7280'}
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
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div />
    </div>
  );
}
