// import { useCurrentBufferContent } from 'modules/editor/useCurrentBufferContent';
// import { useCallback } from 'react';
import { atom, useRecoilValue } from 'recoil';
import { useEffect, useMemo } from 'react';
import PromiseWorker from 'promise-worker';

export const previewBlocks = atom<Record<string, number>>({
  key: 'Preview/Blocks',
  default: {},
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

// 初回に行長さを判定して保存する
// line width以下の長さであるかをページ末尾で判定する

async function* workerGen(): AsyncGenerator<PromiseWorker> {
  const workerResource = await fetch('workers://workers/pageMetrics/index.js');
  const worker = new Worker(URL.createObjectURL(await workerResource.blob()));
  const promised = new PromiseWorker(worker);

  while (true) {
    yield promised;
  }
}

export function useCalcPageMetrics() {
  const blocksRecord = useRecoilValue(previewBlocks);
  const blocks = Object.values(blocksRecord);
  const pageWidth = useRecoilValue(previewPageWidth);
  const blocksLength = blocks.reduce((acc, v) => acc + v, 0);
  const worker = useMemo(() => workerGen(), []);

  useEffect(() => {
    (async () => {
      (await worker.next()).value
        .postMessage({ pageWidth, blocks })
        .then(console.log);
    })();
  }, [blocksLength, pageWidth]);
}
