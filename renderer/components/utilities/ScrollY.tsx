import React from 'react';

export type ScrollYProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export function ScrollY({ children, style }: ScrollYProps) {
  return (
    <div className="overflow-y-scroll border-2" style={style}>
      {children}
    </div>
  );
}
