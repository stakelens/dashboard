import type { ReactNode } from 'react';

export function ArrowChange({ positive, children }: { positive: boolean; children: ReactNode }) {
  const color = positive ? '#22c55e' : '#ef4444';

  return (
    <div className="flex items-center justify-end gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="12"
        viewBox="0 0 14 12"
        style={{
          fill: color,
          transform: positive ? 'rotate(0deg)' : 'rotate(180deg)'
        }}
      >
        <path d="M7 0L13.9282 12H0.0717969L7 0Z"></path>
      </svg>
      <div className="font-mono" style={{ color }}>
        {children}
      </div>
    </div>
  );
}
