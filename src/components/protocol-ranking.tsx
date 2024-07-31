import { useState } from 'react';
import { numberFormater } from '@/lib/format';
import { ArrowChange } from './arrow-change';

const formatter = new Intl.NumberFormat('en-US', { currency: 'USD' });

export function ProtocolRanking({
  protocols
}: {
  protocols: {
    label: string;
    values: { eth: number }[];
  }[];
}) {
  const sortedProtocols = [...protocols].sort((a, b) => {
    const tvlA = a.values[a.values.length - 1].eth;
    const tvlB = b.values[b.values.length - 1].eth;
    return tvlB - tvlA;
  });

  return (
    <table className="w-full overflow-hidden">
      <thead className="bg-[#242424] font-mono text-[#949494] border-b border-white border-opacity-10">
        <tr>
          <th className="p-4 text-sm font-medium text-left border-r border-white border-opacity-10">
            PROTOCOL
          </th>
          <th className="p-4 text-sm font-medium text-left border-r border-white border-opacity-10">
            24H
          </th>
          <th className="p-4 text-sm font-medium text-right border-r border-white border-opacity-10">
            TVL (ETH)
          </th>
        </tr>
      </thead>
      <tbody className="bg-[#191919]">
        {sortedProtocols.map((protocol) => (
          <ProtocolRankingRow
            label={protocol.label}
            values={protocol.values}
            key={protocol.label}
          />
        ))}
      </tbody>
    </table>
  );
}

function percentChange(a: number, b: number): number {
  return (100 * (a - b)) / b;
}

function ProtocolRankingRow({ label, values }: { label: string; values: { eth: number }[] }) {
  const TVL = values[values.length - 1].eth;
  const dayChange = percentChange(values[values.length - 1].eth, values[values.length - 2].eth);

  return (
    <tr className="border-t border-white border-opacity-10">
      <td className="p-4 border-r border-white border-opacity-10">{label}</td>
      <td className="relative p-4 font-light text-right border-r border-white border-opacity-10">
        <ArrowChange positive={dayChange >= 0}>
          <span>
            {Intl.NumberFormat('en-US', {
              maximumFractionDigits: 2
            }).format(dayChange)}
            %
          </span>
        </ArrowChange>
      </td>
      <Cell value={TVL} />
    </tr>
  );
}

function Cell({ value }: { value: number }) {
  const [hover, setHover] = useState(false);
  const formattedValue = formatter.format(value);
  const shortValue = numberFormater(value);

  return (
    <td className="p-4 font-light text-right">
      <div className="relative inline-block">
        <span className="invisible">{formattedValue}</span>
        <span
          className="absolute inset-0 cursor-default"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {hover ? formattedValue : shortValue}
        </span>
      </div>
    </td>
  );
}
