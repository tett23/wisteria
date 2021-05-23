import { useRecoilValue } from 'recoil';
import { previewPages } from './index';

export function usePageSize(): number {
  return useRecoilValue(previewPages).length + 1;
}
