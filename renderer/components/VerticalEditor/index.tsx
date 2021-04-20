import { ScrollY } from 'components/utilities/ScrollY';
import { editorBody } from 'modules/editor';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import css from './VerticalEditor.module.css';

export function VerticalEditor() {
  return (
    <ScrollY>
      <EditorBox />
    </ScrollY>
  );
}

function EditorBox() {
  const content = useRecoilValue(editorBody);
  const [pageWidth, setPageWidth] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  console.log(pageWidth, scrollWidth);

  const pageSize = pageWidth === 0 ? 1 : Math.ceil(scrollWidth / pageWidth);

  return (
    <div>
      <div
        style={{
          backgroundColor: 'gray',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Pages
          pageSize={pageSize}
          content={content ?? ''}
          setPageWidth={setPageWidth}
          setScrollWidth={setScrollWidth}
        ></Pages>
        {/* <div className={css.outer}>
        <div className={css['content-box']} contentEditable>
          {content}
        </div>
      </div> */}
      </div>
    </div>
  );
}

function Pages({
  content,
  pageSize,
  setPageWidth,
  setScrollWidth,
}: {
  content: string;
  pageSize: number;
  setPageWidth: (value: number) => void;
  setScrollWidth: (value: number) => void;
}) {
  console.log('pageSize', pageSize);
  const pages = Array.from({ length: pageSize }).map((_, i) => {
    return (
      <Page
        key={i}
        pageNumber={i + 1}
        text={content}
        setPageWidth={setPageWidth}
        setScrollWidth={setScrollWidth}
      />
    );
  });
  // const sorted = pages.reduce((acc: any, item, idx) => {
  //   const newIdx = idx % 2 === 0 ? idx + 1 : idx - 1;

  //   acc[newIdx] = item;

  //   return acc;
  // }, []);
  if (pages.length === 0) {
    return (
      <div className={css.pages}>
        <BlankPage
          pageRef={{ current: null }}
          pageNumber={1}
          setPageWidth={setPageWidth}
          setScrollWidth={setScrollWidth}
        />
      </div>
    );
  }

  return <div className={css.pages}>{pages}</div>;
}

function Page({
  text,
  pageNumber,
  setPageWidth,
  setScrollWidth,
}: {
  text: string;
  pageNumber: number;
  setPageWidth: (value: number) => void;
  setScrollWidth: (value: number) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (ref.current == null) {
      return;
    }

    const el = ref.current;
    el.scrollLeft = el.scrollWidth - el.clientWidth * pageNumber;

    // el.style.overscrollBehaviorY = 'hidden';
  }, [ref.current]);
  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      console.log(entries);
      const [el] = entries;
      console.log(el.isIntersecting);
      if (isShow !== el.isIntersecting) {
        setIsShow(el.isIntersecting);
      }
    });
    if (ref.current == null) {
      return;
    }

    observer.observe(ref.current);

    return () => {
      if (ref.current == null) {
        return;
      }

      observer.unobserve(ref.current);
    };
  }, [ref.current, isShow]);
  const paragraphs = text
    .split('\n')
    .map((l, i) => <Paragraph key={i + l} text={l}></Paragraph>);

  if (!isShow) {
    return (
      <BlankPage
        pageRef={ref}
        setPageWidth={setPageWidth}
        setScrollWidth={setScrollWidth}
        pageNumber={pageNumber}
      />
    );
  }

  return (
    <div className={css.pageOuter}>
      <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>
        {pageNumber}
      </div>
      <div
        className={css.page}
        ref={(el) => {
          if (el == null) {
            return;
          }

          setPageWidth(el.clientWidth);
          setScrollWidth(el.scrollWidth);

          ref.current = el;
          el.addEventListener('touchmove', (e) => e.preventDefault());
          el.addEventListener('mousewheel', (e) => e.preventDefault());
        }}
        onScroll={(e) => e.preventDefault()}
      >
        {paragraphs}
      </div>
    </div>
  );
}

function BlankPage({
  pageRef: ref,
  pageNumber,
  setPageWidth,
  setScrollWidth,
}: {
  pageRef: MutableRefObject<HTMLDivElement | null>;
  pageNumber: number;
  setPageWidth: (value: number) => void;
  setScrollWidth: (value: number) => void;
}) {
  return (
    <div className={css.pageOuter}>
      <div
        style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}
        ref={(el) => {
          if (el == null) {
            return;
          }

          setPageWidth(el.clientWidth);

          ref.current = el;
        }}
      >
        {pageNumber}
      </div>
      <div className={css.page}></div>
    </div>
  );
}

function Paragraph({ text }: { text: string }) {
  const content = text === '' ? <br /> : <>{text}</>;

  return <div className={css.paragraph}>{content}</div>;
}

function Textarea({ content }: { content: string }) {
  return (
    <div className={css.outer}>
      <div className={css['content-box']}>{content}</div>
    </div>
  );
}

function EditorArea() {}
