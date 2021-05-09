import {
  useGotoRecoilSnapshot,
  useRecoilCallback,
  useRecoilValue,
} from 'recoil';
import {
  editorCurrentBuffer,
  editorCurrentBufferChanged,
} from 'modules/editor';
import { useCallback } from 'react';

export function useEditor() {
  const buf = useRecoilValue(editorCurrentBuffer);
  const makeChanged = useMakeChangedCurrentBuffer();
  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    makeChanged(e.target.value);
  }, []);

  return {
    file: buf,
    onChange,
    disabled: buf == null,
  };
}

function useMakeChangedCurrentBuffer(): (newValue: string) => Promise<void> {
  const gotoSnapshot = useGotoRecoilSnapshot();

  return useRecoilCallback(
    ({ snapshot: { map, getPromise } }) => async (newValue: string) => {
      const buf = await getPromise(editorCurrentBuffer);
      const changed = await getPromise(editorCurrentBufferChanged);

      const next = map(({ set }) => {
        if (buf != null) {
          set(editorCurrentBuffer, { ...buf, body: newValue });
        }
        if (!changed) {
          set(editorCurrentBufferChanged, true);
        }
      });
      gotoSnapshot(next);
    },
    [],
  );
}
