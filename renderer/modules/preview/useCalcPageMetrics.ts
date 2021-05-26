import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useCallback, useEffect } from 'react';
import PromiseWorker from 'promise-worker';
import { previewBlocks, previewPageWidth, previewPages } from './index';

export function useCalcPageMetrics() {
  const blocksRecord = useRecoilValue(previewBlocks);
  const blocks = Object.values(blocksRecord);
  const pageWidth = useRecoilValue(previewPageWidth);
  const setPreviewPages = useSetRecoilState(previewPages);
  const blocksLength = blocks.reduce((acc, v) => acc + v, 0);
  const requester = useProcessMessage<
    {
      pageWidth: number;
      blocks: number[];
    },
    Uint16Array
  >();

  useEffect(() => {
    (async () => {
      const metrics = await requester({ pageWidth, blocks });
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

function useProcessMessage<T, R>(): (message: T) => Promise<R> {
  return useCallback(async (message: T) => {
    const { done, value } = await workerGen().next();
    if (done) {
      throw new Error();
    }

    return await value.postMessage(message);
  }, []);
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
