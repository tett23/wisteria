import { CFile } from 'models/CFile';
import { useCurrentBufferPath } from 'modules/editor/useCurrentBufferPath';
import { FileState } from 'modules/fileView';
import { useFileState } from 'modules/fileView/useFileState';
import { Rename } from './Rename';
import { Saved } from './Saved';

type OwnProps = CFile;

export type FileProps = {
  selected: boolean;
  state: FileState;
} & OwnProps;

export function File(props: OwnProps) {
  const a = useProps(props);

  switch (a.state) {
    case 'saved':
      return <Saved {...a} />;
    case 'renaming':
      return <Rename {...a} />;
    default:
      throw new Error();
  }
}

function useProps(props: OwnProps): FileProps {
  const currentBufferPath = useCurrentBufferPath();
  const state = useFileState(props.path);

  return {
    ...props,
    selected: props.path != null && props.path === currentBufferPath,
    state,
  };
}
