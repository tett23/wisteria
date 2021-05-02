import React from 'react';
import { useRecoilValue } from 'recoil';
import { CFile } from 'models/CFile';
import { fileViewFiles } from 'modules/fileView';
import { File } from './File';

export type FileViewProps = {
  files: CFile[];
};

export function FileView({ files }: FileViewProps) {
  const items = files.map((item) => (
    <div key={item.path} className="py-4">
      <File {...item}></File>
    </div>
  ));

  return <div className="w-72 divide-y">{items}</div>;
}

export function FileViewWC() {
  return <FileView {...useFileViewProps()}></FileView>;
}

function useFileViewProps(): FileViewProps {
  const files = useRecoilValue(fileViewFiles);

  return {
    files,
  };
}
