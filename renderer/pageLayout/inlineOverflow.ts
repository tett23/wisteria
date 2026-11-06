import { BoxAst, BoxAstNode, Direction, Position, UnwrapArray } from './boxAst';
import { boxscript } from './boxscript';
import { A, newA, newMapable } from './newMapable';
import { toNormalizedBoxContent } from './toNormalizedBoxContent';
import { calcSize } from './calcSize';
import { addSize } from './addSize';
import { boxAstUtilFindAndReplace } from './findAndReplace';
import { Size } from 'electron';
import { updateData } from './updateData';

export function inlineOverflow(root: BoxAstNode<'root'>): BoxAstNode<'root'> {
  return replaceFrame(root) as BoxAstNode<'root'>;
}

function replaceFrame<T extends BoxAst>(node: T): T {
  return boxAstUtilFindAndReplace(
    node,
    (item) => item.type === 'frame' && item.boxType === 'block',
    (node: BoxAstNode<'block'>, _, parent) => {
      return {
        ...node,
        children: [
          replaceInline(
            updateData(node, { size: (parent as any).data.size }),
            boxscript('fragment', node.children),
          ),
        ],
      };
    },
  );
}

function replaceInline(
  parent: BoxAstNode<'block'>,
  node: BoxAstNode<'fragment'>,
): BoxAstNode<'fragment'> {
  const parentSize = parent.data.size;
  const parentDirection = parent.data.direction;
  return newMapable(node.children)
    .map((item) => item.map(toNormalizedBoxContent))
    .map((children: any[]) => {
      return children
        .reduce(
          reduceInline(parentDirection, parentSize),
          newA(boxscript('fragment')),
        )
        .unwrap().children;
    })
    .map((children) => boxscript('fragment', children))
    .unwrap();
}

// NOTE: Sizeでないといけない？
// NOTE: intersectionの判定であれば、dirは不要
const isIntersection = (dir: Direction) => (
  left: Size,
  right: Size,
): boolean => {
  switch (dir) {
    case 'horizontal-tb':
      return left.width < right.width;
    case 'vertical-rl':
      return left.height < right.height;
  }
};

const reduceInline = (direction: Direction, parentSize: Size) => (
  acc: A<BoxAstNode<'fragment'>>,
  item: UnwrapArray<BoxAstNode<'block'>['children']>,
): A<BoxAstNode<'fragment'>> => {
  const prevLine = acc.last();
  const currentLineSize = prevLine.size(direction);
  const frameSize = newA(boxscript('fragment', acc)).size(direction);
  const itemSize = calcSize(direction)(item);
  const nextSize = addSize(direction)(currentLineSize, itemSize);
  const isOverflow = isIntersection(direction)(parentSize, nextSize);
  // console.log(parentSize, nextSize);

  if (isOverflow) {
    // console.log({ itemSize, currentLineSize, frameSize });
    const newLine = boxscript('fragment', [updateData(item, {})]);
    return acc.push(newLine);
  }

  return acc.map((a) => newA(a).push(item).unwrap());
};
