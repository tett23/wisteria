import React from 'react';

export type ScrollYProps = {
  children: React.ReactNode;
};

export function ScrollY({ children }: ScrollYProps) {
  return (
    <div
      className="h-scroll h-screen overflow-y-scroll border-2"
      style={{ height: '70vh' }}
    >
      {children}
    </div>
  );
}
