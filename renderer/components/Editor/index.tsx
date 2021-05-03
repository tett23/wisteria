import { useEffect, useRef, useState } from 'react';
import { useEditor } from 'modules/editor/useEditor';

export function Editor() {
  const { value, onChange, disabled } = useEditor();
  const { ref, size } = useSize();

  return (
    <textarea
      ref={ref}
      className="border-2 outline-none"
      style={size}
      onChange={onChange}
      disabled={disabled}
      value={value}
    ></textarea>
  );
}

function useSize() {
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

  return { ref, size: { width, height } };
}
