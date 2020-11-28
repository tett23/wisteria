import { atom } from 'recoil';
import { CFile } from 'models/CFile';

export const fileViewFiles = atom<CFile[]>({
  key: 'FileView/files',
  default: [],
});
