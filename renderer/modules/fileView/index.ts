import { atom } from 'recoil';
import { CFile } from 'models/CFile';

export const fileViewFiles = atom<Record<string, CFile>>({
  key: 'FileView/files',
  default: {},
});

export const fileViewCurrentDirectory = atom<string | null>({
  key: 'FileView/currentDirectory',
  default: null,
});
