const formatter = new Intl.NumberFormat('en-US', { currency: 'USD' });

export function ProtocolRankingRow({
  label,
  values
}: {
  label: string;
  values: { eth: string }[];
}) {
  const TVL = formatter.format(BigInt(values[values.length - 1].eth) / BigInt(1e18));
  const dayChange = formatter.format(
    (BigInt(values[values.length - 1].eth) - BigInt(values[values.length - 2].eth)) / BigInt(1e18)
  );

  return (
    <tr className="border-b border-white border-opacity-10">
      <td className="p-4">{label}</td>
      <td className="p-4 font-light text-right">{dayChange}</td>
      <td className="p-4 font-light text-right">{TVL}</td>
    </tr>
  );
}
