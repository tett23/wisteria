import css from '../Preview.module.css';
import { useRecoilCallback, useSetRecoilState } from 'recoil';
import { PageWidth, ParagraphMetrics } from '../modules/pageMetrics';
import { useCurrentBufferContent } from 'modules/editor';
import { Paragraph } from '../Paragraph';
import { memo, useEffect, useRef } from 'react';

type DummyParaProps = {
  text: string;
  idx: number;
  setParagraphSize: (pair: [number, number]) => void;
};

const MemoizedDummyPara = memo(
  DummpyPara,
  (a, b) => a.text === b.text && a.idx === b.idx,
);
function DummpyPara({ text, idx, setParagraphSize }: DummyParaProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (ref.current == null) {
      return;
    }

    setParagraphSize([idx, ref.current.scrollWidth]);
  }, [text, ref.current == null]);
  return (
    <div ref={ref} className={css.paragraph}>
      <Paragraph text={text}></Paragraph>
    </div>
  );
}

type CalculatePageMetricsProps = {
  content: string | null;
  setParagraphSize: (indexWidthPair: [number, number]) => void;
  setPageWidth: (width: number) => void;
};

const MemoizedCalculatePageMetrics = memo(
  CalculatePageMetrics,
  (a, b) => a.content === b.content,
);

// const MemoizedCalculatePageMetrics(())
export function CalculatePageMetrics({
  content,
  setParagraphSize,
  setPageWidth,
}: CalculatePageMetricsProps) {
  const components = (content ?? '')
    .split('\n')
    .map((text, idx) => (
      <MemoizedDummyPara
        key={idx + text}
        idx={idx}
        text={text}
        setParagraphSize={setParagraphSize}
      />
    ));

  return (
    <div
      style={{
        visibility: 'hidden',
        position: 'absolute',
        top: 0,
        left: -9999,
      }}
    >
      <div className={css.pageOuter}>
        <div className={css.pageContainer}>
          <div
            ref={(el) => setPageWidth(el?.clientWidth ?? 1)}
            className={css.page}
          >
            {components}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CalculatePageMetricsContainer() {
  return <MemoizedCalculatePageMetrics {...useCalculatePageMetrics()} />;
}

function useCalculatePageMetrics(): CalculatePageMetricsProps {
  const content = useCurrentBufferContent();
  const setParagraphSize = useRecoilCallback(
    ({ set }) => ([idx, width]: [number, number]) => {
      set(ParagraphMetrics, (current) => ({ ...current, [idx]: width }));
    },
    [content],
  );
  const setPageWidth = useSetRecoilState(PageWidth);

  return {
    content,
    setParagraphSize,
    setPageWidth,
  };
}
