import { DAY, MONTH, THREE_MONTHS, WEEK, YEAR } from '@/lib/time-constants';
import { ChartButton } from './chart-button';

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
      <ChartButton
        active={filter === DAY}
        onClick={() => setFilter(DAY)}
        label={FILTER_TO_LABEL[DAY].short}
      />

      <ChartButton
        active={filter === WEEK}
        onClick={() => setFilter(WEEK)}
        label={FILTER_TO_LABEL[WEEK].short}
      />

      <ChartButton
        active={filter === MONTH}
        onClick={() => setFilter(MONTH)}
        label={FILTER_TO_LABEL[MONTH].short}
      />

      <ChartButton
        active={filter === THREE_MONTHS}
        onClick={() => setFilter(THREE_MONTHS)}
        label={FILTER_TO_LABEL[THREE_MONTHS].short}
      />

      <ChartButton
        active={filter === YEAR}
        onClick={() => setFilter(YEAR)}
        label={FILTER_TO_LABEL[YEAR].short}
      />

      {/* <ChartButton
        active={filter === Infinity}
        onClick={() => setFilter(Infinity)}
        label={FILTER_TO_LABEL[Infinity].short}
      /> */}
    </div>
  );
}
