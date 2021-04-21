import { usePageContent } from '../modules/pageMetrics';
import { Paragraph } from '../Paragraph';
import css from '../Preview.module.css';

export function Page({
  text,
  pageNumber,
}: {
  text: string;
  pageNumber: number;
}) {
  const [[startIndex, endIndex], offset] = usePageContent(pageNumber);
  const lines = text.split('\n').slice(startIndex, endIndex);
  const paragraphs = lines.map((l, i) => (
    <Paragraph key={i + l} text={l}></Paragraph>
  ));

  return (
    <div className={css.pageOuter}>
      <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>
        {pageNumber}
      </div>
      <div className={css.pageContainer}>
        <div className={css.page} style={{ left: offset }}>
          {paragraphs}
        </div>
      </div>
    </div>
  );
}
