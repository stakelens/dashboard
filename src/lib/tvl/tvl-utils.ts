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

type DataPoint = {
  value: number;
  timestamp: number;
};

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
