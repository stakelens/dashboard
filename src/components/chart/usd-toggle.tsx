export function USDToggele({
  isUSD,
  setIsUSD
}: {
  isUSD: boolean;
  setIsUSD: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold md:text-sm lg:gap-3">
      <div
        className="px-3 py-1 border border-white rounded cursor-pointer select-none border-opacity-10"
        style={{
          backgroundColor: isUSD ? '#2E46C8' : '#242424'
        }}
        onClick={() => setIsUSD(true)}
      >
        USD
      </div>
      <div
        className="px-3 py-1 border border-white rounded cursor-pointer select-none border-opacity-10"
        style={{
          backgroundColor: !isUSD ? '#2E46C8' : '#242424'
        }}
        onClick={() => setIsUSD(false)}
      >
        ETH
      </div>
    </div>
  );
}
