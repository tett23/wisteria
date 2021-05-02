import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { editorBody } from 'modules/editor';

export function Editor() {
  const [content, setContent] = useRecoilState(editorBody);
  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (ref.current == null) {
      return;
    }
    if (ref.current.parentElement == null) {
      return;
    }

    setWidth(ref.current.parentElement.clientWidth);
    setHeight(ref.current.parentElement.clientHeight);

    const observer = new MutationObserver(([mut]) => {
      if (mut == null) {
        return;
      }

      setWidth(ref.current?.parentElement?.clientWidth);
      setHeight(ref.current?.parentElement?.clientHeight);
    });
    observer.observe(ref.current.parentElement, {
      attributes: true,
      attributeFilter: ['style'],
    });

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return (
    <textarea
      ref={ref}
      className="border-2 outline-none"
      style={{ width, height }}
      onChange={onChange}
      value={content ?? ''}
    ></textarea>
  );
}
