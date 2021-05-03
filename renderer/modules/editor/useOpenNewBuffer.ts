import { CFile } from 'models/CFile';
import { useCallback } from 'react';
import { useGotoRecoilSnapshot, useRecoilCallback } from 'recoil';
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
  const gotoSnapshot = useGotoRecoilSnapshot();

  return useRecoilCallback(
    ({ snapshot }) => (file: CFile) => {
      const next = snapshot.map(({ set }) => {
        set(editorCurrentBuffer, file);
        set(editorCurrentBufferChanged, false);
      });
      gotoSnapshot(next);
    },
    [],
  );
}
