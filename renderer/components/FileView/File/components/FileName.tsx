import React from 'react';
import { basename } from 'path';

type FileNameProps = {
  filename: string;
};

export function FileName({ filename }: FileNameProps) {
  return <div className="font-semibold">{basename(filename)}</div>;
}
