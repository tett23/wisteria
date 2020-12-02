import React from 'react';
import { FileViewWC } from './FileView';
import { ProjectViewWC } from './ProjectView';
import { ScrollY } from './utilities/ScrollY';

export type MainViewProps = {};

export function MainView(_: MainViewProps) {
  return (
    <div className="w-screen h-screen border-4">
      <div className="flex flex-row">
        <ScrollY>
          <ProjectViewWC />
        </ScrollY>
        <ScrollY>
          <div className="border-x">
            <FileViewWC />
          </div>
        </ScrollY>
      </div>
    </div>
  );
}
