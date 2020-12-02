import React from 'react';

export type ScrollYProps = {
  children: React.ReactNode;
};

export function ScrollY({ children }: ScrollYProps) {
  return <div className="h-scroll h-screen overflow-y-scroll">{children}</div>;
}
