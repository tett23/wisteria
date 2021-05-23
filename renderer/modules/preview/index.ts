import { atom } from 'recoil';

export const previewBlocks = atom<Record<string, number>>({
  key: 'Preview/Blocks',
  default: {},
});

export const previewPageWidth = atom<number>({
  key: 'Preview/PageWidth',
  default: 0,
});

export type Page = {
  offset: number;
  blockIndex: {
    start: number;
    end: number;
  };
};

export const previewPages = atom<Page[]>({
  key: 'Preview/Pages',
  default: [],
});
