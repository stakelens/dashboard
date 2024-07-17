import { formatDateToDDMMYYYY } from '@/lib/utils';

export type DataPoint = {
  timestamp: number;
  value: number;
};

export function percentChange(chartData: DataPoint[]) {
  const finalValue = chartData[chartData.length - 1].value;
  const initialValue = chartData[0].value;
  return (100 * (finalValue - initialValue)) / initialValue;
}

export function convertChartDenomination({
  data,
  conversionTable
}: {
  data: DataPoint[];
  conversionTable: Record<string, number>;
}) {
  const result = [];

  for (let i = 0; i < data.length; i++) {
    const timestamp = data[i].timestamp;
    const value = data[i].value;

    const dateString = formatDateToDDMMYYYY(new Date(timestamp));
    let conversionValue = conversionTable[dateString];

    if (!conversionValue) {
      console.warn(`Conversion value not found for ${dateString}.`);
      conversionValue = 1;
    }

    result[i] = {
      value: value * conversionValue,
      timestamp: timestamp
    };
  }

  return result;
}
