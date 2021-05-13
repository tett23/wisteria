import { Project } from 'models/Project';
import { useDirectoryState } from 'modules/projects/useDirectoryState';
import { Directory } from './Directory';

type BodyProps = {
  project: Project;
};

export function Body({ project: { path } }: BodyProps) {
  const { state } = useProps(path);

  switch (state) {
    case 'saved':
      return (
        <div>
          <Directory path={path}></Directory>
        </div>
      );
    case 'renaming':
      return null;
    case 'creating':
      return null;
  }
}

function useProps(path: string) {
  const state = useDirectoryState(path);

  return {
    state,
  };
}
