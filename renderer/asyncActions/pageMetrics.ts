import PromiseWorker from 'promise-worker';

export async function* pageMetricsGenerator(): AsyncGenerator<
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

const gen = pageMetricsGenerator();

export async function calcuratePageMetrics(message: {
  pageWidth: number;
  blocks: number[];
}): Promise<Uint16Array> {
  const { done, value } = await gen.next();
  if (done) {
    throw new Error();
  }

  return await value.postMessage(message);
}
