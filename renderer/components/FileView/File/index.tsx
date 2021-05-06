import React, { useCallback } from 'react';
import { CFile } from 'models/CFile';
import { basename } from 'path';
import { useOpenNewBuffer } from 'modules/editor/useOpenNewBuffer';
import classNames from 'classnames';
import { useCurrentBufferPath } from 'modules/editor/useCurrentBufferPath';
import { FileMenu } from './FileMenu';

type OwnProps = CFile;

export type FileProps = {
  selected: boolean;
} & OwnProps;

const Memoized = React.memo(
  (props: FileProps) => {
    return props.selected ? (
      <SelectedFile {...props} />
    ) : (
      <UnselectedFile {...props} />
    );
  },
  (a, b) => a.selected === b.selected && a.body === b.body && a.path === b.path,
);

export function File(props: OwnProps) {
  return <Memoized {...useProps(props)}></Memoized>;
}

function useProps(props: OwnProps): FileProps {
  const currentBufferPath = useCurrentBufferPath();

  return {
    ...props,
    selected: props.path != null && props.path === currentBufferPath,
  };
}

function SelectedFile(props: FileProps) {
  return <FileBase className="bg-white" {...props}></FileBase>;
}

function UnselectedFile(props: FileProps) {
  return <FileBase {...props}></FileBase>;
}

export type FileBaseProps = {
  className?: string;
} & OwnProps;

function FileBase(props: FileBaseProps) {
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
        <div className="flex justify-between">
          <FileName filename={props.path}></FileName>
          <FileMenu></FileMenu>
        </div>
        <Body body={props.body}></Body>
      </div>
    </div>
  );
}

type FileNameProps = {
  filename: string;
};

function FileName({ filename }: FileNameProps) {
  return <div className="font-semibold">{basename(filename)}</div>;
}

type BodyProps = {
  body: string;
};

function Body({ body }: BodyProps) {
  return (
    <div className="text-gray-400 min-h-12 max-h-12 overflow-hidden break-all">
      {body}
    </div>
  );
}
