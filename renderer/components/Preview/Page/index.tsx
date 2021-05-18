import classNames from 'classnames';
import { editorCursorParagraphIndex } from 'modules/editor';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { usePageContent } from '../modules/pageMetrics';
import { Paragraph } from '../Paragraph';
import css from '../Preview.module.css';
import { BlankPage } from './BlankPage';

export function Page(props: { text: string; pageNumber: number }) {
  const { ref, isIntersecting, pageNumber, offset, paragraphs } = usePageProps(
    props,
  );

  return (
    <div ref={ref}>
      {isIntersecting ? (
        <PageContent
          pageNumber={pageNumber}
          offset={offset}
          paragraphs={paragraphs}
        />
      ) : (
        <BlankPage pageNumber={pageNumber} />
      )}
    </div>
  );
}

function usePageProps({
  text,
  pageNumber,
}: {
  pageNumber: number;
  text: string;
}) {
  const [[startIndex, endIndex], offset] = usePageContent(pageNumber);
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
  const paraIndex = useRecoilValue(editorCursorParagraphIndex) ?? 0;
  const isIncludePara = startIndex <= paraIndex && paraIndex <= endIndex;
  useEffect(() => {
    if (!isIncludePara) {
      return;
    }
    console.log('scroll', ref.current);

    ref.current?.scrollTo({ top: -100 });
  }, [isIncludePara]);

  const lines = text.split('\n').slice(startIndex, endIndex);
  const paragraphs = lines.map((l, i) => (
    <Paragraph key={i + l} text={l}></Paragraph>
  ));

  return {
    ref,
    isIntersecting,
    pageNumber,
    offset,
    paragraphs,
  };
}

function PageContent({
  pageNumber,
  offset,
  paragraphs,
}: {
  pageNumber: number;
  offset: number;
  paragraphs: JSX.Element[];
}) {
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
