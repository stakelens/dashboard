import { AreaChart } from '@tremor/react';

export function Chart() {
  return (
    <div>
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
      <AreaChart
        className="h-[308px] font-mono"
        data={new Array(12).fill(0).map((_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          }),
          'ETH Locked': 2000 + Math.random() * 1000
        }))}
        index="date"
        showLegend={false}
        yAxisWidth={65}
        valueFormatter={(number) => `$${Intl.NumberFormat('us').format(number).toString()}`}
        categories={['ETH Locked']}
      />
    </div>
  );
}
