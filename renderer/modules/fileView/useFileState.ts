import { useRecoilValue } from 'recoil';
import { fileViewFileStates } from './index';

export function useFileState(path: string) {
  const states = useRecoilValue(fileViewFileStates);

  return states[path] ?? 'saved';
}
