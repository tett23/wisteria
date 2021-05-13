import { useRecoilValue } from 'recoil';
import { projectDirectoryStates } from '.';

export function useDirectoryState(path: string) {
  const states = useRecoilValue(projectDirectoryStates);

  return states[path] ?? 'saved';
}
