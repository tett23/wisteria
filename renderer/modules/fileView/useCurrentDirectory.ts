import { useRecoilValue } from 'recoil';
import { fileViewCurrentDirectory } from './index';

export function useCurrentDirectory(): string | null {
  return useRecoilValue(fileViewCurrentDirectory);
}
