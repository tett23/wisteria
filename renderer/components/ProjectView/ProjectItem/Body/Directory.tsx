import { useDirectoryState } from 'modules/projects/useDirectoryState';
import { Renaming } from './Renaming';
import { Saved } from './Saved';

export function Directory({ path }: { path: string }) {
  const state = useDirectoryState(path);

  switch (state) {
    case 'saved':
      return <Saved path={path}></Saved>;
    case 'renaming':
      return <Renaming path={path}></Renaming>;
    case 'creating':
      return null;
  }
}
