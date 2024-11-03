import { ChartButton } from './chart-button';

export function USDToggele({
  isUSD,
  setIsUSD
}: {
  isUSD: boolean;
  setIsUSD: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold md:text-sm lg:gap-3">
      <ChartButton label="USD" active={isUSD} onClick={() => setIsUSD(true)} />
      <ChartButton label="ETH" active={!isUSD} onClick={() => setIsUSD(false)} />
    </div>
  );
}
