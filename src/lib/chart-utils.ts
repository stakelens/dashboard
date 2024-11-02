import { DAY } from './time-constants';

export type DataPoint = {
  timestamp: number;
  value: number;
};

export function percentChange(chartData: DataPoint[]) {
  if (chartData.length < 2) {
    return 0;
  }

  const finalValue = chartData[chartData.length - 1].value;
  const initialValue = chartData[0].value;

  return (100 * (finalValue - initialValue)) / initialValue;
}

export function convertChartDenomination({
  data,
  conversionTable
}: {
  data: DataPoint[];
  conversionTable: Record<number, number>;
}) {
  const result = [];

  for (let i = 0; i < data.length; i++) {
    const timestamp = data[i].timestamp;
    const value = data[i].value;

    let conversionValue = conversionTable[Math.floor(timestamp / DAY) * DAY];

    if (!conversionValue) {
      console.warn(`Conversion value not found for ${timestamp}.`);
      conversionValue = 1;
    }

    result[i] = {
      value: value * conversionValue,
      timestamp: timestamp
    };
  }

  return result;
}

/**
 * Combines multiple data points arrays into a single array.
 *
 * The result will have `numberOfSegments` data points.
 * The value of each data point is the sum of the values of the data points at the same timestamp.
 */
export function combineDataPoints({
  dataPointsArray,
  numberOfSegments,
  endTimestamp,
  startTimestamp
}: {
  dataPointsArray: DataPoint[][];
  numberOfSegments: number;
  endTimestamp: number;
  startTimestamp: number;
}): DataPoint[] {
  const result: DataPoint[] = [];
  const timestamps = range(startTimestamp, endTimestamp, numberOfSegments);

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
 * The array will have `segments` elements.
 *
 * The first element will be `min` and the last element will be `max`.
 */
function range(min: number, max: number, segments: number): number[] {
  const result: number[] = [];

  for (let i = 0; i < segments; i++) {
    result[i] = min + ((max - min) / (segments - 1)) * i;
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
