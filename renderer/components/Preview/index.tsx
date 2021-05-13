import { ScrollY } from 'components/utilities/ScrollY';
import { editorCurrentBuffer } from 'modules/editor';
import { CSSProperties } from 'react';
import { useRecoilValue } from 'recoil';
import { CalculatePageMetricsContainer } from './GetPageMetrics';
import { PageSize } from './modules/pageMetrics';
import { Pages } from './Pages';
import css from './Preview.module.css';

type PreviewProps = {
  style?: CSSProperties;
};

export function Preview({ style }: PreviewProps) {
  const buffer = useRecoilValue(editorCurrentBuffer);
  const pageSize = useRecoilValue(PageSize);

  return (
    <div>
      <CalculatePageMetricsContainer />
      <ScrollY
        style={{
          backgroundColor: 'gray',
          ...style,
        }}
      >
        <div className={css.previewBackground}>
          <Pages content={buffer?.body ?? ''} pageSize={pageSize} />
        </div>
      </ScrollY>
    </div>
  );
}
