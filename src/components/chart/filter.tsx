import { DAY, MONTH, THREE_MONTHS, WEEK, YEAR } from '@/lib/time-constants';
import { ChartButton } from './chart-button';

export const FILTERS = {
  day: {
    value: DAY,
    long: '1 day',
    short: '24H'
  },
  week: {
    value: WEEK,
    long: '7 days',
    short: '7D'
  },
  month: {
    value: MONTH,
    long: '1 month',
    short: '1M'
  },
  three_months: {
    value: THREE_MONTHS,
    long: '3 months',
    short: '3M'
  },
  year: {
    value: YEAR,
    long: '1 year',
    short: '1Y'
  }
};

export type Filter = keyof typeof FILTERS;

export function Filter({
  setFilter,
  filter
}: {
  setFilter: (value: Filter) => void;
  filter: Filter;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 font-mono text-xs font-bold md:text-sm lg:gap-3">
      <ChartButton
        active={filter === 'day'}
        onClick={() => setFilter('day')}
        label={FILTERS['day'].short}
      />

      <ChartButton
        active={filter === 'week'}
        onClick={() => setFilter('week')}
        label={FILTERS['week'].short}
      />

      <ChartButton
        active={filter === 'month'}
        onClick={() => setFilter('month')}
        label={FILTERS['month'].short}
      />

      <ChartButton
        active={filter === 'three_months'}
        onClick={() => setFilter('three_months')}
        label={FILTERS['three_months'].short}
      />

      <ChartButton
        active={filter === 'year'}
        onClick={() => setFilter('year')}
        label={FILTERS['year'].short}
      />
    </div>
  );
}
