import { useRecoilValue } from 'recoil';
import { editorCurrentBuffer } from '.';

export function useCurrentBufferPath() {
  return useRecoilValue(editorCurrentBuffer)?.path;
}
