import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Paragraph } from '../Paragraph';
import css from '../Preview.module.css';
import { BlankPage } from './BlankPage';

export function Page({
  pageNumber,
  offset,
  source,
}: {
  pageNumber: number;
  offset: number;
  blockIndex: { start: number; end: number };
  source: string[];
}) {
  const { ref, isIntersecting } = usePageProps();

  return (
    <div ref={ref}>
      {isIntersecting ? (
        <PageContent pageNumber={pageNumber} offset={offset} source={source} />
      ) : (
        <BlankPage pageNumber={pageNumber} />
      )}
    </div>
  );
}

export const MemoizedPage = React.memo(
  Page,
  (a, b) =>
    a.pageNumber === b.pageNumber &&
    a.offset === b.offset &&
    a.source.join() === b.source.join(),
);

function usePageProps() {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (ref.current == null) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const [el] = entries;
      if (el == null) {
        return;
      }

      setIsIntersecting(el.isIntersecting);
    });
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return {
    ref,
    isIntersecting,
  };
}

function PageContent({
  pageNumber,
  offset,
  source,
}: {
  pageNumber: number;
  offset: number;
  source: string[];
}) {
  const paragraphs = source.map((l, i) => (
    <Paragraph key={i + l} text={l}></Paragraph>
  ));

  return (
    <div className={classNames(css.pageOuter, 'select-none')}>
      <PageNumber pageNumber={pageNumber} />
      <div className={css.pageContainer}>
        <div className={css.page} style={{ left: offset }}>
          {paragraphs}
        </div>
      </div>
    </div>
  );
}

function PageNumber({ pageNumber }: { pageNumber: number }) {
  const className = classNames({
    'text-left': pageNumber % 2 === 0,
    'text-right': pageNumber % 2 !== 0,
  });

  return (
    <div
      className={className}
      style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}
    >
      <span>{pageNumber}</span>
    </div>
  );
}
