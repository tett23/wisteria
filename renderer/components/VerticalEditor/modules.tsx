import { atom } from 'recoil';

export const editingContent = atom<string>({
  key: 'editingContent',
  default: 'hogehogeaaaaaaaaaa',
});
