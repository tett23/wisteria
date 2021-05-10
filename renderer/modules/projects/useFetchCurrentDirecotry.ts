import { fileViewCurrentDirectory } from 'modules/fileView';
import { useRecoilCallback } from 'recoil';

export function useFetchCurrentDirectory() {
  return useRecoilCallback(
    ({ snapshot }) => async () => {
      return snapshot.getPromise(fileViewCurrentDirectory);
    },
    [],
  );
}
