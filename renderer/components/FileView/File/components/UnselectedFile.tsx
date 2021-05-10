import React, { ReactNode } from 'react';
import { FileBase } from './FileBase';

export function UnselectedFile(props: { path: string; children: ReactNode }) {
  return <FileBase {...props} />;
}
