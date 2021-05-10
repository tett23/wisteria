import { fileViewCurrentDirectory } from 'modules/fileView';
import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { useReloadFileView } from './useReloadFileView';

export function useSelectDirectory(): (path: string) => Promise<void> {
  const setSelectedDirectory = useSetRecoilState(fileViewCurrentDirectory);
  const reload = useReloadFileView();

  return useCallback(async (path: string) => {
    setSelectedDirectory(path);
    await reload(path);
  }, []);
}
