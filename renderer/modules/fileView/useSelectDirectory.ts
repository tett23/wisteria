import { useMessageRequester } from 'hooks/useMessageRequester';
import { fileViewFiles, fileViewSelectedDirectory } from 'modules/fileView';
import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

export function useSelectDirectory(): (path: string) => Promise<void> {
  const setFileViewFiles = useSetRecoilState(fileViewFiles);
  const setSelectedDirectory = useSetRecoilState(fileViewSelectedDirectory);
  const requester = useMessageRequester();

  return useCallback(async (path: string) => {
    const result = await requester('listDirectoryFiles', path);

    setFileViewFiles(result);
    setSelectedDirectory(path);
  }, []);
}
