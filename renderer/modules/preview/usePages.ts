import { useRecoilValue } from 'recoil';
import { previewPages } from './index';

export function usePages() {
  return useRecoilValue(previewPages);
}
