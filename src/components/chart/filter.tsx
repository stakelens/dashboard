import { DAY, MONTH, THREE_MONTHS, WEEK, YEAR } from '@/lib/time-constants';

export const FILTER_TO_LABEL = {
  [DAY]: {
    long: '1 day',
    short: '24H'
  },
  [WEEK]: {
    long: '7 days',
    short: '7D'
  },
  [MONTH]: {
    long: '1 month',
    short: '1M'
  },
  [THREE_MONTHS]: {
    long: '3 months',
    short: '3M'
  },
  [YEAR]: {
    long: '1 year',
    short: '1Y'
  },
  [Infinity]: {
    long: 'All time',
    short: 'MAX'
  }
};

export function Filter({
  setFilter,
  filter
}: {
  setFilter: (value: number) => void;
  filter: number;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 font-mono text-xs font-bold md:text-sm lg:gap-3">
      <FilterOption setFilter={setFilter} currentValue={filter} value={DAY} />
      <FilterOption setFilter={setFilter} currentValue={filter} value={WEEK} />
      <FilterOption setFilter={setFilter} currentValue={filter} value={MONTH} />
      <FilterOption setFilter={setFilter} currentValue={filter} value={3 * MONTH} />
      <FilterOption setFilter={setFilter} currentValue={filter} value={YEAR} />
      {/* <FilterOption setFilter={setFilter} currentValue={filter} value={Infinity} /> */}
    </div>
  );
}

function FilterOption({
  value,
  setFilter,
  currentValue
}: {
  value: number;
  setFilter: (value: number) => void;
  currentValue: number;
}) {
  return (
    <div
      className={
        currentValue === value
          ? 'bg-[#2E46C8] rounded border border-white border-opacity-10 px-3 py-1 select-none duration-100'
          : 'bg-[#242424] rounded border border-white border-opacity-10 px-3 py-1 select-none cursor-pointer duration-100 hover:brightness-90'
      }
      onClick={() => setFilter(value)}
    >
      {FILTER_TO_LABEL[value].short}
    </div>
  );
}
