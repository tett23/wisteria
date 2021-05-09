import { BufferInfoWC } from './BufferInfo';
import { Editor } from './Editor';
import { FileView } from './FileView';
import { Preview } from './Preview';
import { CalculatePageMetricsContainer } from './Preview/GetPageMetrics';
import { ProjectViewContainer } from './ProjectView';
import { Resizable } from './utilities/Resizable';

export type MainViewProps = {};

export function MainView(_: MainViewProps) {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Resizable
        direction="vertical"
        className="w-screen h-screen flex"
        defaultSize="30vw"
      >
        <div className="h-full flex">
          <div className="w-full border-r-2 border-gray-500">
            <ProjectViewContainer />
          </div>
          <div>
            <FileView />
          </div>
        </div>
        <div className="h-full w-full">
          <Resizable
            direction="horizontal"
            className="w-full h-full"
            defaultSize="80vh"
          >
            <div className="w-full h-full overflow-hidden">
              <BufferInfoWC />
              <Preview />
            </div>
            <div className="w-full h-full">
              <Editor />
            </div>
          </Resizable>
        </div>
      </Resizable>
      <CalculatePageMetricsContainer />
    </div>
  );
}
