import { useMessageRequester } from 'hooks/useMessageRequester';
import { fileViewFiles } from 'modules/fileView';
import { useFetchCurrentDirectory } from 'modules/projects/useFetchCurrentDirecotry';
import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

export function useReloadFileView() {
  const setFileViewFiles = useSetRecoilState(fileViewFiles);
  const fetchCurrentDirectory = useFetchCurrentDirectory();
  const requester = useMessageRequester();

  return useCallback(async (path?: string) => {
    const currentDirectory =
      path == null ? await fetchCurrentDirectory() : path;
    if (currentDirectory == null) {
      return;
    }

    const result = await requester('listDirectoryFiles', currentDirectory);
    if (result instanceof Error) {
      return;
    }

    const files = Object.fromEntries(result.map((v) => [v.path, v]));

    setFileViewFiles(files);
  }, []);
}
