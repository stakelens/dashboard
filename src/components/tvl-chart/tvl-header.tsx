import { formatter } from '@/components/utils/format';
import { ArrowChange } from '../arrow-change';
import { percentChange, type DataPoint } from '@/components/chart/chart-utils';

export function TVLHeader({
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
  const TVL = lastValue ? formatter.format(lastValue.value) : 0;

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
        <ArrowChange change={rangeChange}>
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
