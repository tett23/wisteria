import React, { ReactNode, useCallback } from 'react';
import { useOpenNewBuffer } from 'modules/editor/useOpenNewBuffer';
import classNames from 'classnames';

export function FileBase(props: FileBaseProps) {
  const open = useOpenNewBuffer();
  const onClick = useCallback(() => {
    open(props.path);
  }, []);
  const className = classNames(
    'px-2 py-4 select-none hover:bg-white',
    props.className,
  );

  return (
    <div className={className}>
      <div className="h12 cursor-pointer" onClick={onClick}>
        {props.children}
      </div>
    </div>
  );
}
type FileBaseProps = {
  path: string;
  className?: string;
  children: ReactNode;
};
