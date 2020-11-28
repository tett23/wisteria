import React from 'react';
import { FileViewWC } from './FileView';
import { ScrollY } from './utilities/ScrollY';

export type MainViewProps = {};

export function MainView(_: MainViewProps) {
  return (
    <div>
      <ScrollY>
        <FileViewWC />
      </ScrollY>
    </div>
  );
}
