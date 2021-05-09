import { useMessageRequester } from 'hooks/useMessageRequester';
import { fileViewFiles } from 'modules/fileView';
import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCurrentDirectory } from './useCurrentDirectory';

export function useReloadFileView() {
  const currentDirectory = useCurrentDirectory();
  const setFileViewFiles = useSetRecoilState(fileViewFiles);
  const requester = useMessageRequester();

  return useCallback(async () => {
    if (currentDirectory == null) {
      return;
    }

    const result = await requester('listDirectoryFiles', currentDirectory);

    setFileViewFiles(result);
  }, [currentDirectory]);
}
