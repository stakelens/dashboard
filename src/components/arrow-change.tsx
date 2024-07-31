import type { ReactNode } from 'react';

export function ArrowChange({ change, children }: { change: number; children: ReactNode }) {
  const THRESHOLD = 0.005;

  let color = '#949494';
  let SvgIcon = NeutralSvg;

  if (Math.abs(change) >= THRESHOLD) {
    if (change > 0) {
      color = '#22c55e';
      SvgIcon = UpArrowSvg;
    } else {
      color = '#ef4444';
      SvgIcon = DownArrowSvg;
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <SvgIcon color={color} />
      <div className="font-mono" style={{ color }}>
        {children}
      </div>
    </div>
  );
}

function UpArrowSvg({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="12"
      viewBox="0 0 14 12"
      style={{ fill: color }}
    >
      <path d="M7 0L13.9282 12H0.0717969L7 0Z"></path>
    </svg>
  );
}

function DownArrowSvg({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="12"
      viewBox="0 0 14 12"
      style={{ fill: color, transform: 'rotate(180deg)' }}
    >
      <path d="M7 0L13.9282 12H0.0717969L7 0Z"></path>
    </svg>
  );
}

function NeutralSvg({ color }: { color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12">
      <rect x="0" y="5" width="14" height="2" fill={color} />
    </svg>
  );
}
