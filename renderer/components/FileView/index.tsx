import React from 'react';
import { File } from './File';

export type FileViewProps = {
  files: Array<{
    filename: string;
    body: string;
  }>;
};

export function FileView({ files }: FileViewProps) {
  const items = files.map((item) => (
    <div className="py-4">
      <File key={item.filename} {...item}></File>
    </div>
  ));

  return <div className="w-72 divide-y">{items}</div>;
}
