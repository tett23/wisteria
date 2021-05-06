import React from 'react';
import { useRecoilValue } from 'recoil';
import { CFile } from 'models/CFile';
import { fileViewFiles } from 'modules/fileView';
import { File } from './File';

export type FileListProps = {
  files: CFile[];
};

export function FileList({ files }: FileListProps) {
  const items = files.map((item) => <File key={item.path} {...item}></File>);

  return <div className="divide-y">{items}</div>;
}

export function FileListWC() {
  return <FileList {...useFileListProps()}></FileList>;
}

function useFileListProps(): FileListProps {
  const files = useRecoilValue(fileViewFiles);

  return {
    files,
  };
}
