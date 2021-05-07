import { useMessageRequester } from 'hooks/useMessageRequester';
import { fileViewFiles, fileViewSelectedDirectory } from 'modules/fileView';
import { useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

export function useReloadFileView() {
  const selectedDirectory = useRecoilValue(fileViewSelectedDirectory);
  const setFileViewFiles = useSetRecoilState(fileViewFiles);
  const requester = useMessageRequester();

  return useCallback(async () => {
    if (selectedDirectory == null) {
      return;
    }

    const result = await requester('listDirectoryFiles', selectedDirectory);

    setFileViewFiles(result);
  }, [selectedDirectory]);
}
