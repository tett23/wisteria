import { useRecoilValue } from 'recoil';
import { fileViewSelectedDirectory } from './index';

export function useCurrentDirectory(): string | null {
  return useRecoilValue(fileViewSelectedDirectory);
}
