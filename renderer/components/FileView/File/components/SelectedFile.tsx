import React, { ReactNode } from 'react';
import { FileBase } from './FileBase';

export function SelectedFile(props: { path: string; children: ReactNode }) {
  return <FileBase className="bg-white" {...props} />;
}
