import { editorCursorParagraphIndex } from 'modules/editor';
import { useEditor } from 'modules/editor/useEditor';
import { useCallback, useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';

export function Editor() {
  const { file, onChange, disabled } = useEditor();
  const ref = useRef<HTMLTextAreaElement>(null);
  const onClick = useCallback(() => {
    if (ref.current == null) {
      return;
    }

    ref.current.focus();
  }, [ref.current]);
  const setParaIndex = useSetRecoilState(editorCursorParagraphIndex);

  useEffect(() => {
    if (ref.current == null || file == null) {
      return;
    }
    console.log('selection statr', ref.current?.selectionStart);

    const a = file.body.slice(0, ref.current.selectionStart);
    const paraCount = Array.from<null>({ length: a.length }).reduce(
      (acc, _, idx) => (a[idx] === '\n' ? acc + 1 : acc),
      0,
    );
    setParaIndex(paraCount);
  }, [ref, file?.body]);

  const elem = [
    <textarea
      key={file?.path ?? 'none'}
      className="outline-none h-full mx-4"
      style={{ width: '42rem', overflowAnchor: 'none' }}
      onChange={onChange}
      disabled={disabled}
      defaultValue={file?.body}
      ref={ref}
    />,
  ];

  return (
    <div onClick={onClick} className="w-full h-full text-center py-4">
      {elem}
    </div>
  );
}
