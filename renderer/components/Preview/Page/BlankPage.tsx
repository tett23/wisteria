import css from '../Preview.module.css';

export function BlankPage({ pageNumber }: { pageNumber: number }) {
  return (
    <div className={css.pageOuter}>
      <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>
        {pageNumber}
      </div>
      <div className={css.page}></div>
    </div>
  );
}
