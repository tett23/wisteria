import { Page } from '../Page';
import { BlankPage } from '../Page/BlankPage';

export function Pages({
  content,
  pageSize,
}: {
  content: string;
  pageSize: number;
}) {
  if (pageSize === 0) {
    return (
      <div>
        <BlankPage pageNumber={1} />
      </div>
    );
  }

  const pages = Array.from({ length: pageSize })
    .reduce<number[][]>((acc, _: any, i) => {
      if (i % 2 === 0) {
        acc.push([i]);
        return acc;
      }

      acc[acc.length - 1]?.push(i);

      return acc;
    }, [])
    .map((value) => {
      return (
        <div key={value.join()} className="flex flex-row-reverse pb-10">
          {value.map((pageIndex) => (
            <Page key={pageIndex} pageNumber={pageIndex + 1} text={content} />
          ))}
        </div>
      );
    });

  return <div>{pages}</div>;
}
