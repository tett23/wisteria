import { ScrollY } from 'components/utilities/ScrollY';
import { FileListWC } from 'components/FileView/FileList';
import { FileListHeader } from './FileListHeader';

export function FileView() {
  return (
    <div className="w-72">
      <FileListHeader />
      <ScrollY className="h-screen bg-coolGray-200">
        <div className="border-x">
          <FileListWC />
        </div>
      </ScrollY>
    </div>
  );
}
