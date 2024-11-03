import { getDateText } from './utils/get-date-text';

export function LastUpdated({ timestamp }: { timestamp: number }) {
  return (
    <div
      className="py-2 px-4 rounded bg-[#22c55e] bg-opacity-10 text-[#22c55e] text-xs border border-[#22c55e] border-opacity-10 flex items-center justify-center gap-2"
      id="last-updated"
    >
      <div className="bg-[#22c55e] rounded-full w-2 h-2 relative shadow ">
        <div className="bg-[#22c55e] rounded-full w-2 h-2 animate-ping absolute"></div>
      </div>
      Last update {getDateText(new Date(timestamp))}
    </div>
  );
}
