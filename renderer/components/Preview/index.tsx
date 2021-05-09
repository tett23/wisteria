import { ScrollY } from 'components/utilities/ScrollY';
import { editorCurrentBuffer } from 'modules/editor';
import { useRecoilValue } from 'recoil';
import { PageSize } from './modules/pageMetrics';
import { Pages } from './Pages';

type PreviewProps = {};

export function Preview({}: PreviewProps) {
  const buffer = useRecoilValue(editorCurrentBuffer);
  const pageSize = useRecoilValue(PageSize);

  return (
    <ScrollY
      style={{
        backgroundColor: 'gray',
      }}
      className="h-full flex justify-center"
    >
      <div
        className="flex justify-center py-10"
        style={{ height: 'fit-content' }}
      >
        <Pages content={buffer?.body ?? ''} pageSize={pageSize} />
      </div>
    </ScrollY>
  );
}
