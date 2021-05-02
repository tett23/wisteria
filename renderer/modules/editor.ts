import { CFile } from 'models/CFile';
import { useCallback } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

export const editorCurrentBuffer = atom<CFile | null>({
  key: 'Editor/currentBuffer',
  default: null,
});

export function useCurrentBufferContent(): string | null {
  return useRecoilValue(editorCurrentBuffer)?.body ?? null;
}

export function useSetCurrentBufferContent() {
  const set = useSetRecoilState(editorCurrentBuffer);

  return useCallback((value: string) => {
    set((current) => {
      if (current == null) {
        return null;
      }

      return { ...current, body: value ?? '' };
    });
  }, []);
}
