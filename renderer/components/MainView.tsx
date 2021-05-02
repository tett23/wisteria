import React from 'react';
import { Editor } from './Editor';
import { FileViewWC } from './FileView';
import { Preview } from './Preview';
import { ProjectViewContainer } from './ProjectView';
import { Resizable } from './utilities/Resizable';
import { ScrollY } from './utilities/ScrollY';

export type MainViewProps = {};

export function MainView(_: MainViewProps) {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Resizable
        direction="vertical"
        style={{ display: 'flex', flexDirection: 'row' }}
        defaultSize={'20vh'}
      >
        <div className="h-screen">
          <ScrollY>
            <ProjectViewContainer />
          </ScrollY>
          <ScrollY>
            <div className="border-x">
              <FileViewWC />
            </div>
          </ScrollY>
        </div>
        <div className="h-screen">
          <Resizable
            direction="horizontal"
            style={{ height: '100vh' }}
            defaultSize={'80vh'}
          >
            <Preview />
            <div>
              <Editor></Editor>
            </div>
          </Resizable>
        </div>
      </Resizable>
    </div>
  );
}
