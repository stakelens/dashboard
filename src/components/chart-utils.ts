import { closestDay } from '@/server/utils';

export type DataPoint = {
  timestamp: number;
  value: number;
};

export function percentChange(data: DataPoint[]) {
  if (data.length < 2) {
    return 0;
  }

  const first = data[0];
  const last = data[data.length - 1];

  if (!first || !last) {
    return 0;
  }

  return (100 * (last.value - first.value)) / first.value;
}

export function convertChartDenomination({
  data,
  conversionTable
}: {
  data: DataPoint[];
  conversionTable: Record<number, number>;
}) {
  const result = [];

  for (const dataPoint of data) {
    const index = closestDay(dataPoint.timestamp);
    let conversionValue = conversionTable[index];

    if (conversionValue === undefined) {
      console.warn(`Conversion value not found for ${dataPoint.timestamp}.`);
      conversionValue = 1;
    }

    result.push({
      value: dataPoint.value * conversionValue,
      timestamp: dataPoint.timestamp
    });
  }

  return result;
}

/**
 * Combines multiple data points arrays into a single array.
 * The value of each data point is the sum of the values of the data points at the same timestamp.
 */
export function combineDataPoints({
  dataPointsArray,
  stepSize,
  endTimestamp,
  startTimestamp
}: {
  dataPointsArray: DataPoint[][];
  stepSize: number;
  endTimestamp: number;
  startTimestamp: number;
}): DataPoint[] {
  const result: DataPoint[] = [];
  const timestamps = range(startTimestamp, endTimestamp, stepSize);

  for (const timestamp of timestamps) {
    let value = 0;

    for (const dataPoints of dataPointsArray) {
      value += getValueForTimestamp(dataPoints, timestamp);
    }

    result.push({
      value,
      timestamp
    });
  }

  return result;
}

/**
 * Returns an array of numbers from min to max.
 * The first element will be `min` and the last element will be `max`.
 */
function range(min: number, max: number, step: number): number[] {
  const result: number[] = [];

  for (let i = min; i <= max; i += step) {
    result.push(i);
  }

  if (result[result.length - 1] !== max) {
    result[result.length - 1] = max;
  }

  return result;
}

/**
 * Returns the value of the chart at the given timestamp.
 * Assumes that the data points are sorted by timestamp.
 *
 * We assume that the value is constant between two data points.
 */
function getValueForTimestamp(dataPoints: DataPoint[], timestamp: number): number {
  for (let i = 0; i < dataPoints.length; i++) {
    const current = dataPoints[i]!;
    const next = dataPoints[i + 1];

    if (!next) {
      return current.value;
    }

    if (current.timestamp <= timestamp && next.timestamp > timestamp) {
      return current.value;
    }
  }

  return 0;
}
