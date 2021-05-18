// import { useCurrentBufferContent } from 'modules/editor/useCurrentBufferContent';
// import { useCallback } from 'react';
import { atom } from 'recoil';

export const previewBlocks = atom<number[]>({
  key: 'Preview/Blocks',
  default: [],
});

export const previewPageWidth = atom<number>({
  key: 'Preview/PageWidth',
  default: 0,
});

type Page = {
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

// function usePreviewBlocks() {}
//
// function usePageProps({
//   text,
//   pageNumber,
// }: {
//   pageNumber: number;
//   text: string;
// }) {
//   const content = useCurrentBufferContent();
//   const pageWidth = useRecoilValue(previewPageWidth);
//   const blocks = useRecoilValue(previewBlocks);

//   return useCallback(async () => {
//     const arr = new Uint16Array(blocks);
//     const paragraphs = content?.split('\n') ?? [];

//     const pages = [];
//   }, [content, pageWidth, blocks.reduce((acc, v) => acc + v, 0)]);
// }

// function getOffset(props: {
//   master: { blocks: ArrayLike<number>; pageWidth: number; prevOffest: number };
// }) {
//   props.master.blocks;
// }

// 初回に行長さを判定して保存する
// line width以下の長さであるかをページ末尾で判定する
