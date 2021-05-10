import React from 'react';
import { CFile } from 'models/CFile';
import { File } from './File';
import { useFileList } from 'modules/fileView/useFileList';

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
  const files = useFileList();

  return {
    files,
  };
}
