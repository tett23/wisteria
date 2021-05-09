import { useEditor } from 'modules/editor/useEditor';
import { useCallback, useRef } from 'react';

export function Editor() {
  const { file, onChange, disabled } = useEditor();
  const ref = useRef<HTMLTextAreaElement>(null);
  const onClick = useCallback(() => {
    if (ref.current == null) {
      return;
    }

    ref.current.focus();
  }, [ref.current]);
  const elem = [
    <textarea
      key={file?.path ?? 'none'}
      className="outline-none h-full mx-4"
      style={{ width: '42rem', overflowAnchor: 'none' }}
      onChange={onChange}
      disabled={disabled}
      defaultValue={file?.body}
      ref={ref}
    ></textarea>,
  ];

  return (
    <div onClick={onClick} className="w-full h-full text-center py-4">
      {elem}
    </div>
  );
}
