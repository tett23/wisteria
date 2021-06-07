import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import { previewBlocks, previewPageWidth, previewPages } from './index';
import { calcuratePageMetrics } from 'asyncActions/pageMetrics';

export function useCalcPageMetrics() {
  const blocksRecord = useRecoilValue(previewBlocks);
  const blocks = Object.values(blocksRecord);
  const pageWidth = useRecoilValue(previewPageWidth);
  const setPreviewPages = useSetRecoilState(previewPages);
  const blocksLength = blocks.reduce((acc, v) => acc + v, 0);

  useEffect(() => {
    (async () => {
      const metrics = await calcuratePageMetrics({ pageWidth, blocks });
      const pages = splitEach(Array.from(metrics), 3).map(
        ([start, end, offset]: any) => ({
          offset,
          blockIndex: { start, end },
        }),
        [],
      );

      setPreviewPages(pages);
    })();
  }, [blocksLength, pageWidth]);
}

function splitEach<T>(arr: Array<T>, count: number): Array<T[]> {
  return Array.from({ length: arr.length / count - 1 }).reduce<T[][]>(
    (acc, _, idx) => {
      const a = arr.slice(idx * count, (idx + 1) * count);
      acc.push(a);

      return acc;
    },
    [],
  );
}
