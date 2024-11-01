import type { ReactNode } from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

type Change = {
  color: string;
  arrow: ReactNode;
};

function getChange(change: number, threshold: number = 0.005): Change {
  if (change > threshold) {
    return {
      color: '#22c55e',
      arrow: <ArrowUp size={16} />
    };
  }

  if (change < -threshold) {
    return {
      color: '#ef4444',
      arrow: <ArrowDown size={16} />
    };
  }

  return {
    color: '#949494',
    arrow: <Minus size={16} />
  };
}

export function ArrowChange({ change, children }: { change: number; children: ReactNode }) {
  const { color, arrow } = getChange(change);

  return (
    <div className="font-mono flex items-center justify-end gap-2" style={{ color }}>
      {arrow}
      {children}
    </div>
  );
}
