import { useEditor } from 'modules/editor/useEditor';

export function Editor() {
  const { file, onChange, disabled } = useEditor();
  const elem = [
    <textarea
      key={file?.path ?? 'none'}
      className="border-2 outline-none w-full h-full"
      style={{ overflowAnchor: 'none' }}
      onChange={onChange}
      disabled={disabled}
      defaultValue={file?.body}
    ></textarea>,
  ];

  return <>{elem}</>;
}
