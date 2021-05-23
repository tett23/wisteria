import { ScrollY } from 'components/utilities/ScrollY';
import { editorCurrentBuffer } from 'modules/editor';
import { useCalcPageMetrics } from 'modules/preview/useCalcPageMetrics';
import { usePageSize } from 'modules/preview/usePageSize';
import { useRecoilValue } from 'recoil';
import { Pages } from './Pages';

type PreviewProps = {};

export function Preview({}: PreviewProps) {
  const buffer = useRecoilValue(editorCurrentBuffer);
  const pageSize = usePageSize();
  useCalcPageMetrics();

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
