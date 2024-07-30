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
