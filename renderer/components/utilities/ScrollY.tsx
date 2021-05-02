import React from 'react';
import classNames from 'classnames';

export type ScrollYProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

export function ScrollY({ children, style, ...props }: ScrollYProps) {
  const className = classNames('overflow-y-scroll border-2', props.className);
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
