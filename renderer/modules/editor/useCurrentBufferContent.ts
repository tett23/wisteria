import { useRecoilValue } from 'recoil';
import { editorCurrentBuffer } from './index';

export function useCurrentBufferContent() {
  return useRecoilValue(editorCurrentBuffer)?.body ?? null;
}
