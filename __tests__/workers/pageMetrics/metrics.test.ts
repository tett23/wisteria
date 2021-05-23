import { metrics } from 'workers/pageMetrics/metrics';

describe('pageMetrics', () => {
  it('no overflow', () => {
    const ret = metrics({ blocks: [5, 5, 5], pageWidth: 5 });
    expect(splitEach(ret)).toEqual([
      [0, 0, 0],
      [1, 1, 0],
      [2, 2, 0],
    ]);
  });

  it('overflow', () => {
    const ret = metrics({ blocks: [10, 100, 20, 30, 5], pageWidth: 30 });
    expect(splitEach(ret)).toEqual([
      [0, 1, 0],
      [1, 1, 20],
      [1, 1, 50],
      [1, 2, 80],
      [2, 3, 10],
      [3, 5, 20],
    ]);
  });

  function splitEach(arr: Uint16Array, count: number = 3) {
    return arr.reduce<Array<number[]>>((acc, v, idx) => {
      const pos = Math.floor(idx / count);
      if (idx % 3 === 0) {
        acc[pos] = [];
      }

      acc[pos]!.push(v);

      return acc;
    }, []);
  }
});
