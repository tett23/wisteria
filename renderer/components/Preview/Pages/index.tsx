import { Page } from '../Page';
import { BlankPage } from '../Page/BlankPage';
import css from '../Preview.module.css';

export function Pages({
  content,
  pageSize,
}: {
  content: string;
  pageSize: number;
}) {
  if (pageSize === 0) {
    return (
      <div className={css.pages}>
        <BlankPage pageNumber={1} />
      </div>
    );
  }

  const pages = Array.from({ length: pageSize }).map((_, i) => {
    return <Page key={i} pageNumber={i + 1} text={content} />;
  });

  return <div className={css.pages}>{pages}</div>;
}
