import { useMessageRequester } from 'hooks/useMessageRequester';
import { CDirectory } from 'models/CFile';
import { projectDirectories } from 'modules/projects';
import { useCallback, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

export function useFetchDirectory(path: string): CDirectory {
  const dir = useDirectory(path);
  const listDirectory = useListDirectory();
  useEffect(() => {
    listDirectory(path);
  }, []);

  return dir;
}

function useDirectory(path: string): CDirectory {
  const directory = useRecoilValue(projectDirectories);

  return {
    path,
    entries: directory[path]?.entries ?? [],
  };
}

export function useSetDirectory(): (directory: CDirectory) => void {
  const setDirectories = useSetRecoilState(projectDirectories);

  return useCallback((directory: CDirectory) => {
    setDirectories((current) => ({ ...current, [directory.path]: directory }));
  }, []);
}

export function useListDirectory(): (
  path: string,
) => Promise<CDirectory | undefined> {
  const requester = useMessageRequester();
  const setDirectory = useSetDirectory();

  return useCallback(async (path: string) => {
    const result = await requester('listDirectory', path);
    if (result instanceof Error) {
      return;
    }

    setDirectory(result);

    return result;
  }, []);
}
