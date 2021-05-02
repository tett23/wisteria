import { atom, selector, useRecoilValue } from 'recoil';

export const ParagraphMetrics = atom<Record<number, number>>({
  key: 'Preview/PageMetrics',
  default: {},
});

export const PageWidth = atom<number>({
  key: 'Preview/PageWidth',
  default: 1,
});

export const TotalContentWidth = selector({
  key: 'Preview/PageMetrics/TotalWidth',
  get: ({ get }) =>
    Object.entries(get(ParagraphMetrics)).reduce(
      (acc, [, width]) => acc + width,
      0,
    ),
});

export const PageSize = selector({
  key: 'Preview/PageSize',
  get: ({ get }) => {
    return Math.ceil(get(TotalContentWidth) / get(PageWidth) || 1);
  },
});

export function usePageContent(page: number): PageContentReturn {
  const metrics = useRecoilValue(ParagraphMetrics);
  const pageWidth = useRecoilValue(PageWidth);
  const items = Object.entries(metrics).reduce((acc: number[], [i, v]) => {
    acc[Number(i)] = v;
    return acc;
  }, []);

  const [startLineIndex, offset] = getOffset(
    { metrics: items, targetWidth: (page - 1) * pageWidth },
    0,
    0,
    0,
    0,
  );

  const endLineIndex = getEndIndex(
    items.slice(startLineIndex),
    pageWidth,
    -offset,
    startLineIndex,
  );

  return [[startLineIndex, endLineIndex], offset];
}

type PageContentReturn = [[number, number], number];

type LineIndexOffsetPair = [number, number];

function getOffset(
  master: { readonly metrics: number[]; readonly targetWidth: number },
  consumedWidth: number,
  index: number,
  prevPara: number,
  prevConsumedWidth: number,
): LineIndexOffsetPair {
  if (consumedWidth === master.targetWidth) {
    return [index, 0];
  }
  if (consumedWidth >= master.targetWidth) {
    const offset = master.targetWidth - (prevConsumedWidth + prevPara);
    return [index - 1, offset];
  }
  const [paraWidth, ...tail] = master.metrics;
  if (paraWidth == null) {
    return [index, 0];
  }

  return getOffset(
    { metrics: tail, targetWidth: master.targetWidth },
    consumedWidth + paraWidth,
    index + 1,
    prevPara,
    consumedWidth,
  );
}

function getEndIndex(
  metrics: number[],
  pageWidth: number,
  consumeWidth: number,
  index: number,
): number {
  if (consumeWidth >= pageWidth) {
    return index + 1;
  }

  const [paraWidth, ...tail] = metrics;
  if (paraWidth == null) {
    return index;
  }

  return getEndIndex(tail, pageWidth, consumeWidth + paraWidth, index + 1);
}
