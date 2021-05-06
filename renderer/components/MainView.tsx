import { BufferInfoWC } from './BufferInfo';
import { Editor } from './Editor';
import { FileView } from './FileView';
import { Preview } from './Preview';
import { ProjectViewContainer } from './ProjectView';
import { Resizable } from './utilities/Resizable';

export type MainViewProps = {};

export function MainView(_: MainViewProps) {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className="flex">
        <div className="h-screen flex">
          <Resizable
            direction="vertical"
            style={{ display: 'flex', flexDirection: 'row' }}
            defaultSize={'20vh'}
          >
            <div className="border-x">
              <ProjectViewContainer />
            </div>
            <div className="border-x">
              <FileView></FileView>
            </div>
          </Resizable>
        </div>
        <div className="h-screen">
          <BufferInfoWC></BufferInfoWC>
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
      </div>
    </div>
  );
}
