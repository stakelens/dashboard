import { numberFormater } from '@/format';
import { useState } from 'react';
import { ArrowChange } from './arrow-change';

const formatter = new Intl.NumberFormat('en-US', { currency: 'USD' });

export function ProtocolRanking({
  protocols
}: {
  protocols: {
    label: string;
    values: { eth: string }[];
  }[];
}) {
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
        {protocols.map((protocol) => (
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

export function bigIntDiv(numerator: bigint, denominator: bigint, decimals: number = 6): number {
  const decimalsHelper = 10 ** decimals;
  return Number((numerator * BigInt(decimalsHelper)) / denominator) / decimalsHelper;
}

function percentChange(a: bigint, b: bigint): number {
  return 100 * bigIntDiv(a - b, b);
}

function ProtocolRankingRow({ label, values }: { label: string; values: { eth: string }[] }) {
  const TVL = Number(BigInt(values[values.length - 1].eth) / BigInt(1e18));

  const dayChange = percentChange(
    BigInt(values[values.length - 1].eth),
    BigInt(values[values.length - 2].eth)
  );

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

  return (
    <td
      className="relative p-4 font-light text-right"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover ? formatter.format(value) : numberFormater(value)}
    </td>
  );
}
