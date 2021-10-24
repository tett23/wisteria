import { ScrollY } from 'components/utilities/ScrollY';
import { editorCurrentBuffer } from 'modules/editor';
import { useCalcPageMetrics } from 'modules/preview/useCalcPageMetrics';
import { useRecoilValue } from 'recoil';
import { pageLayout } from '../../pageLayout';
import { Pages } from './Pages';
import { useRef, useEffect } from 'react';

type PreviewProps = {};

export function Preview({}: PreviewProps) {
  const buffer = useRecoilValue(editorCurrentBuffer);
  useCalcPageMetrics();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (canvasRef.current == null) {
      return;
    }
    if (divRef.current == null) {
      return;
    }

    console.log(
      divRef.current.scrollHeight,
      divRef.current.clientHeight,
      divRef.current.offsetHeight,
    );
    const mm = divRef.current.scrollHeight / 100;

    pageLayout(canvasRef.current, buffer?.body ?? '', {
      pageSize: {
        width: 148 * mm,
        height: 210 * mm,
      },
      mmPx: mm,
    });
  });

  return (
    <ScrollY
      style={{
        backgroundColor: 'gray',
      }}
      className="h-full flex justify-center"
    >
      <div className="py-10" style={{ height: 'fit-content' }}>
        <div ref={divRef} style={{ height: '100mm' }} />
        <canvas ref={canvasRef} />
        <Pages content={buffer?.body ?? ''} />
      </div>
    </ScrollY>
  );
}
