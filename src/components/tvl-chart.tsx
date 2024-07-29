import { combineTVLs } from '@/lib/tvl/tvl-utils';
import { numberFormater } from '@/lib/format';
import { ArrowChange } from './arrow-change';
import { USDToggele } from './chart/usd-toggle';
import { useMemo, useRef, useState } from 'react';
import { Filter, FILTER_TO_LABEL } from './chart/filter';
import { TimeChart } from './chart/time-chart';
import { useETHPrice } from '@/lib/eth-prices';
import { YEAR } from '@/lib/time-constants';
import { convertChartDenomination, percentChange, type DataPoint } from '@/lib/chart-utils';
import html2canvas from 'html2canvas';
import { getDateText } from '@/lib/utils';

function useCombineTVL(data: DataPoint[][], filter: number) {
  const cache = useRef<Record<number, DataPoint[]>>({});

  return useMemo(() => {
    if (cache.current[filter]) {
      return cache.current[filter];
    }

    cache.current[filter] = combineTVLs({
      tvls: data,
      divisions: 365,
      max: Date.now(),
      min: Date.now() - filter
    });

    return cache.current[filter];
  }, [data, filter]);
}

function convertETHChartToUSD(data: DataPoint[], key: number) {
  const ethPrice = useETHPrice();
  const usdCache = useRef<Record<number, DataPoint[]>>({});

  return useMemo(() => {
    if (!ethPrice) {
      return [];
    }

    if (usdCache.current[key]) {
      return usdCache.current[key];
    }

    usdCache.current[key] = convertChartDenomination({
      data,
      conversionTable: ethPrice
    });

    return usdCache.current[key];
  }, [data, key, ethPrice]);
}

export function TVLChart({
  title,
  logo,
  description,
  tvls
}: {
  tvls: DataPoint[][];
  title: string;
  logo?: string;
  description: string;
}) {
  const [filter, setFilter] = useState(YEAR);
  const [isUSD, setIsUSD] = useState(false);
  const timestamp = getLastTimestamp(tvls);

  const ethTVL = useCombineTVL(tvls, filter);
  const usdTVL = convertETHChartToUSD(ethTVL, filter);

  const TVL = useMemo(() => (isUSD ? usdTVL : ethTVL), [isUSD, usdTVL, ethTVL]);

  return (
    <div className="relative bg-[#111] p-8 rounded border border-white border-opacity-10">
      {isUSD && usdTVL.length == 0 && <LoadingOverlay />}
      <TVLHeader
        title={title}
        logo={logo}
        description={description}
        changeRange={FILTER_TO_LABEL[filter].long}
        isUSD={isUSD}
        data={TVL}
      />
      <div className="mt-4 md:mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <USDToggele isUSD={isUSD} setIsUSD={setIsUSD} />
          <Filter filter={filter} setFilter={setFilter} />
        </div>
        <TimeChart data={TVL} />
        <div className="flex items-center justify-end gap-2">
          <LastUpdated timestamp={timestamp} />
          <CopyToClipboard />
        </div>
      </div>
    </div>
  );
}

function getLastTimestamp(tvls: DataPoint[][]) {
  let lastTimestamp = 0;

  for (const tvl of tvls) {
    for (const value of tvl) {
      if (value.timestamp > lastTimestamp) {
        lastTimestamp = value.timestamp;
      }
    }
  }

  return lastTimestamp;
}

function LastUpdated({ timestamp }: { timestamp: number }) {
  return (
    <div className="py-2 px-4 rounded bg-[#22c55e] bg-opacity-10 text-[#22c55e] text-xs border border-[#22c55e] border-opacity-10 flex items-center justify-center gap-2">
      <div className="bg-[#22c55e] rounded-full w-2 h-2 relative shadow ">
        <div className="bg-[#22c55e] rounded-full w-2 h-2 animate-ping absolute"></div>
      </div>
      Last update {getDateText(new Date(timestamp))}
    </div>
  );
}

function CopyToClipboard() {
  const [showCopyMsg, setShowCopyMsg] = useState(false);

  return (
    <div className="flex items-center justify-end gap-3">
      <div
        className="border border-white border-opacity-10 rounded p-2 bg-[#242424] hover:bg-[#222] duration-200 cursor-pointer flex items-center justify-center gap-2 relative"
        onClick={async () => {
          setShowCopyMsg((value) => {
            if (value) {
              return true;
            }

            setTimeout(() => setShowCopyMsg(false), 1000);

            return true;
          });

          setTimeout(async () => {
            const chart = document.getElementById('tvl-chart');

            if (!chart) {
              return;
            }

            const canvas = await html2canvas(chart);

            canvas.toBlob(function (blob) {
              if (!blob) {
                return;
              }

              const item = new ClipboardItem({ 'image/png': blob });
              navigator.clipboard.write([item]);
            });
          }, 300);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="w-4 h-4"
        >
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
        <div
          className="absolute border border-white border-opacity-10 p-4 rounded-lg bg-[#111] w-[230px] text-center z-[100] shadow-xl text-sm select-none"
          style={{
            right: '0px',
            opacity: showCopyMsg ? '100%' : '0%',
            top: showCopyMsg ? '-65px' : '0px',
            transition: 'opacity 0.2s, top 0.3s',
            pointerEvents: 'none'
          }}
        >
          Image copied to clipboard! 🎉
        </div>
      </div>
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      Loading...
    </div>
  );
}

function TVLHeader({
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
  const TVL = lastValue ? numberFormater(lastValue.value) : 0;

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
        <ArrowChange positive={rangeChange >= 0}>
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
