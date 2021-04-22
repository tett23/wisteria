import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { editorBody } from 'modules/editor';

export function Editor() {
  const [content, setContent] = useRecoilState(editorBody);
  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);

  return (
    <textarea
      className="border-2 w-screen h-48"
      onChange={onChange}
      value={content ?? ''}
    ></textarea>
  );
}
