import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useEffect, useMemo } from 'react';
import PromiseWorker from 'promise-worker';
import { previewBlocks, previewPageWidth, previewPages } from './index';

export function useCalcPageMetrics() {
  const blocksRecord = useRecoilValue(previewBlocks);
  const blocks = Object.values(blocksRecord);
  const pageWidth = useRecoilValue(previewPageWidth);
  const setPreviewPages = useSetRecoilState(previewPages);
  const blocksLength = blocks.reduce((acc, v) => acc + v, 0);
  const worker = useMemo(() => workerGen(), []);

  useEffect(() => {
    (async () => {
      const metrics = await (
        await worker.next()
      ).value.postMessage<Uint16Array>({
        pageWidth,
        blocks,
      });
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

async function* workerGen(): AsyncGenerator<
  PromiseWorker,
  PromiseWorker,
  PromiseWorker
> {
  const workerResource = await fetch('workers://workers/pageMetrics/index.js');
  const worker = new Worker(URL.createObjectURL(await workerResource.blob()));
  const promised = new PromiseWorker(worker);

  while (true) {
    yield promised;
  }
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
