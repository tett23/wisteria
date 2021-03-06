import { usePages } from 'modules/preview/usePages';
import { MemoizedPage } from '../Page';

export function Pages({ content }: { content: string }) {
  const pages = usePages();
  const lines = content.split('\n');

  const items = pages.map((props, idx) => {
    const paragraphs = lines.slice(
      props.blockIndex.start,
      props.blockIndex.end + 1,
    );
    return (
      <MemoizedPage
        key={idx}
        pageNumber={idx + 1}
        source={paragraphs}
        {...props}
      />
    );
  });
  const items2 = splitEach(items).flatMap(([a, b]) => [b, a]);

  return (
    <div className="grid grid-flow-row grid-cols-2 gap-y-10">{items2}</div>
  );
}

function splitEach<T>(arr: Array<T>) {
  return arr.reduce<Array<T[]>>((acc, v, idx) => {
    const pos = Math.floor(idx / 2);
    if (acc[pos] == null) {
      acc[pos] = [];
    }

    acc[pos]?.push(v);

    return acc;
  }, []);
}
