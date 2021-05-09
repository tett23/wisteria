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
      <div className="flex w-screen h-screen">
        <Resizable
          direction="vertical"
          className="w-full h-full flex"
          defaultSize="30vw"
        >
          <div className="h-screen flex">
            <div className="w-full border-r-2 border-gray-500">
              <ProjectViewContainer />
            </div>
            <div>
              <FileView></FileView>
            </div>
          </div>
          <div className="h-screen w-full">
            <BufferInfoWC></BufferInfoWC>
            <Resizable
              direction="horizontal"
              className="w-full h-full"
              defaultSize="80vh"
            >
              <Preview />
              <div className="w-full h-full">
                <Editor></Editor>
              </div>
            </Resizable>
          </div>
        </Resizable>
      </div>
      <CalculatePageMetricsContainer />
    </div>
  );
}
