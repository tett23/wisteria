import { ScrollY } from 'components/utilities/ScrollY';
import { editorBody } from 'modules/editor';
import { useRecoilValue } from 'recoil';
import { CalculatePageMetricsContainer } from './GetPageMetrics';
import { PageSize } from './modules/pageMetrics';
import { Pages } from './Pages';
import css from './Preview.module.css';

export function Preview() {
  const content = useRecoilValue(editorBody);
  const pageSize = useRecoilValue(PageSize);

  return (
    <>
      <CalculatePageMetricsContainer />
      <ScrollY>
        <div className={css.previewBackground}>
          <Pages content={content ?? ''} pageSize={pageSize} />
        </div>
      </ScrollY>
    </>
  );
}
