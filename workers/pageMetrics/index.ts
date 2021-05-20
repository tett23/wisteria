import registerPromiseWorker from 'promise-worker/register';

registerPromiseWorker(f);

function f({ blocks, pageWidth }: { blocks: number[]; pageWidth: number }) {
  console.log(blocks, pageWidth);
  const pageCount = Math.ceil(
    blocks.reduce((acc, v) => acc + v, 0) / pageWidth,
  );
  const master = { blocks, pageWidth };
  const elems = Array.from({ length: pageCount }).reduce<
    Array<[number, number, number, boolean]>
  >((acc) => {
    const prev = acc[acc.length - 1] ?? [0, 0, 0, false];
    const prevOverflow = prev[2] - master.pageWidth;
    const start = prev[3] ? prev[1] : prev[1] + 1;

    acc.push(
      g({
        master,
        v: { start, cursor: start, offset: prevOverflow, consumedWidth: 0 },
      }),
    );

    return acc;
  }, []);

  return new Uint16Array(elems.flatMap((v) => [v[0], v[1], v[2]]));
}

function g({
  master,
  v: { start, cursor, offset, consumedWidth },
}: {
  master: { blocks: number[]; pageWidth: number };
  v: { start: number; cursor: number; offset: number; consumedWidth: number };
}): [number, number, number, boolean] {
  const size = master.blocks[cursor];
  if (size == null) {
    return [0, 0, 0, false];
  }

  if (consumedWidth + size >= master.pageWidth) {
    return [start, cursor, offset, consumedWidth + size === master.pageWidth];
  }

  return g({
    master,
    v: {
      start,
      offset,
      cursor: cursor + 1,
      consumedWidth: consumedWidth + size,
    },
  });
}
