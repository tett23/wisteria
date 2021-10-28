import { BoxAst, BoxAstNode, Direction, Position } from './boxAst';
import { boxscript } from './boxscript';
import { newMapable } from './box';
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
      console.log({ parent });
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
    .map((children) =>
      children.reduce(
        (acc, item) => {
          const prev = acc[acc.length - 1];
          if (prev == null) {
            throw new Error();
          }

          const currentLineSize = calcSize(parentDirection)(prev);
          const frameSize = calcSize(parentDirection)(
            boxscript('fragment', acc),
          );
          const prevPos = ((): Position => {
            switch (parentDirection) {
              case 'horizontal-tb':
                return {
                  left: 0,
                  top: frameSize.height,
                };
              case 'vertical-rl':
                return {
                  left: frameSize.width,
                  top: 0,
                };
            }
          })();
          const itemSize = calcSize(parentDirection)(item);
          const nextSize = addSize(parentDirection)(currentLineSize, itemSize);
          const isOverflow = isIntersection(parentDirection)(
            parentSize,
            nextSize,
          );
          console.log(parentSize, nextSize);

          if (isOverflow) {
            console.log({ itemSize, currentLineSize, frameSize });
            const newLine = boxscript('fragment', [
              updateData(item, {
                position: ((): Position => {
                  switch (parentDirection) {
                    case 'horizontal-tb':
                      return {
                        left: 0,
                        top: frameSize.height,
                      };
                    case 'vertical-rl':
                      return {
                        left: frameSize.width,
                        top: 0,
                      };
                  }
                })(),
              }),
            ]);
            acc.push(newLine);

            return acc;
          }

          prev.children.push(
            updateData(item, {
              position: ((): Position => {
                switch (parentDirection) {
                  case 'horizontal-tb':
                    return {
                      left: currentLineSize.width,
                      top: prevPos.top,
                    };
                  case 'vertical-rl':
                    return {
                      left: prevPos.left,
                      top: currentLineSize.height,
                    };
                }
              })(),
            }),
          );

          return acc;
        },
        [boxscript('fragment')],
      ),
    )
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
