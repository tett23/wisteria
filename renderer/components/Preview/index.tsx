import { ScrollY } from 'components/utilities/ScrollY';
import { editorCurrentBuffer } from 'modules/editor';
import { useCalcPageMetrics } from 'modules/preview/useCalcPageMetrics';
import { useRecoilValue } from 'recoil';
import { Pages } from './Pages';

type PreviewProps = {};

export function Preview({}: PreviewProps) {
  const buffer = useRecoilValue(editorCurrentBuffer);
  useCalcPageMetrics();

  return (
    <ScrollY
      style={{
        backgroundColor: 'gray',
      }}
      className="h-full flex justify-center"
    >
      <div className="py-10" style={{ height: 'fit-content' }}>
        <Pages content={buffer?.body ?? ''} />
      </div>
    </ScrollY>
  );
}
