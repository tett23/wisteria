import { ScrollY } from 'components/utilities/ScrollY';
import { useRecoilValue } from 'recoil';
import { editingContent } from './modules';
import css from './VerticalEditor.module.css';

export function VerticalEditor() {
  return (
    <ScrollY>
      <EditorBox />
    </ScrollY>
  );
}

function EditorBox() {
  const content = useRecoilValue(editingContent);

  return (
    <div className={css.outer}>
      <div className={css['content-box']} contentEditable>
        {content}
      </div>
    </div>
  );
}
