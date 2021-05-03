import { CFile } from 'models/CFile';
import { atom } from 'recoil';

export const editorCurrentBuffer = atom<CFile | null>({
  key: 'Editor/currentBuffer',
  default: null,
});

export const editorCurrentBufferChanged = atom<boolean>({
  key: 'Editor/currentBufferChanged',
  default: false,
});
