import { useMessageRequester } from 'hooks/useMessageRequester';
import { editorCurrentBufferChanged } from 'modules/editor';
import { useFetchCurrentBuffer } from 'modules/editor/useFetchCurrentBuffer';
import { useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSetRecoilState } from 'recoil';

export function HotKeysEffect() {
  const save = useSaveBuffer();
  useHotkeys(
    'command+s,ctrl+s',
    () => {
      save();
    },
    { enableOnTags: ['TEXTAREA'] },
  );

  return null;
}

function useSaveBuffer() {
  const requester = useMessageRequester();
  const setChanged = useSetRecoilState(editorCurrentBufferChanged);
  const fetchCurrentBuffer = useFetchCurrentBuffer();

  return useCallback(async () => {
    const buf = await fetchCurrentBuffer();
    if (buf == null) {
      return;
    }

    const result = await requester('writeFile', buf);
    if (result instanceof Error) {
      return;
    }

    setChanged(false);
  }, []);
}
