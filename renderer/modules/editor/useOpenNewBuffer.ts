import { CFile } from 'models/CFile';
import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  editorCurrentBuffer,
  editorCurrentBufferChanged,
} from 'modules/editor';
import { useMessageRequester } from 'hooks/useMessageRequester';

export function useOpenNewBuffer() {
  const openFile = useOpenFile();
  const requester = useMessageRequester();

  return useCallback(async (path: string) => {
    const file = await requester('readFile', path);
    if (file == null) {
      return;
    }

    openFile(file);
  }, []);
}

function useOpenFile() {
  const setBuffer = useSetRecoilState(editorCurrentBuffer);
  const setChanged = useSetRecoilState(editorCurrentBufferChanged);

  return useCallback((file: CFile) => {
    setBuffer(file);
    setChanged(false);
  }, []);
}
