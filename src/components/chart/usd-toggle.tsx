export function USDToggele({
  isUSD,
  setIsUSD
}: {
  isUSD: boolean;
  setIsUSD: (value: boolean) => void;
}) {
  return (
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
  );
}
