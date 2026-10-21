import type { ReactNode } from 'react';

export default function Tilt({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
