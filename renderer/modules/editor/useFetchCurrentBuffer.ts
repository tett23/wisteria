import { useRecoilCallback } from 'recoil';
import { editorCurrentBuffer } from 'modules/editor';

export function useFetchCurrentBuffer() {
  return useRecoilCallback(
    ({ snapshot }) => async () => {
      return await snapshot.getPromise(editorCurrentBuffer);
    },
    [],
  );
}
