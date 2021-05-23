export function metrics({
  blocks,
  pageWidth,
}: {
  blocks: number[];
  pageWidth: number;
}) {
  const pageCount = Math.ceil(
    blocks.reduce((acc, v) => acc + v, 0) / pageWidth,
  );
  const master = { blocks, pageWidth };
  const init = pageMetrics({
    master,
    state: { start: 0, cursor: 0, offset: 0, consumedWidth: 0 },
  });
  const elems = Array.from({ length: pageCount - 1 }).reduce<
    Array<[number, number, number]>
  >(
    (acc) => {
      const prev = acc[acc.length - 1];
      if (prev == null) {
        throw new Error();
      }

      const [, prevEnd, nextOffset] = prev;
      const hasOverflow = nextOffset === 0;
      const cursor = hasOverflow ? prevEnd + 1 : prevEnd;

      acc.push(
        pageMetrics({
          master,
          state: {
            start: cursor,
            cursor,
            offset: nextOffset,
            consumedWidth: 0,
          },
        }),
      );

      return acc;
    },
    [init],
  );

  return new Uint16Array(
    elems.flatMap(([a, b], idx, arr) => [a, b, (arr[idx - 1] ?? [])[2] ?? 0]),
  );
}

function pageMetrics({
  master,
  state: { start, cursor, offset, consumedWidth },
}: {
  master: { blocks: number[]; pageWidth: number };
  state: {
    start: number;
    cursor: number;
    offset: number;
    consumedWidth: number;
  };
}): [number, number, number] {
  const currentBlock = master.blocks[cursor];
  if (currentBlock == null) {
    return [start, cursor, 0];
  }

  const width = -offset + consumedWidth + currentBlock;
  if (width === master.pageWidth) {
    return [start, cursor, 0];
  }
  if (width >= master.pageWidth) {
    const nextOffset = -offset + consumedWidth - master.pageWidth;
    return [start, cursor, Math.abs(nextOffset)];
  }

  return pageMetrics({
    master,
    state: {
      start,
      cursor: cursor + 1,
      offset,
      consumedWidth: consumedWidth + currentBlock,
    },
  });
}
