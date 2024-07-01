import { dataFormater } from '@/format';
import { useState } from 'react';

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
          <th className="text-left text-sm font-medium p-4 border-r border-white border-opacity-10">
            PROTOCOL
          </th>
          <th className="text-left text-sm font-medium p-4 border-r border-white border-opacity-10">
            24H Volume
          </th>
          <th className="text-right text-sm font-medium p-4 border-r border-white border-opacity-10">
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

function ProtocolRankingRow({ label, values }: { label: string; values: { eth: string }[] }) {
  const TVL = Number(BigInt(values[values.length - 1].eth) / BigInt(1e18));
  const dayChange = Number(
    (BigInt(values[values.length - 1].eth) - BigInt(values[values.length - 2].eth)) / BigInt(1e18)
  );

  return (
    <tr className="border-b border-white border-opacity-10">
      <td className="p-4">{label}</td>
      <Cell value={dayChange} />
      <Cell value={TVL} />
    </tr>
  );
}

function Cell({ value }: { value: number }) {
  const [hover, setHover] = useState(false);

  return (
    <td
      className="p-4 font-light text-right relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover ? formatter.format(value) : dataFormater(value)}
    </td>
  );
}
