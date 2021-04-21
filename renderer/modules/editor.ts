import { atom } from 'recoil';

export const editorBody = atom<string>({
  key: 'Editor/body',
  default: '',
});
