import {
  BoxAst,
  BoxAstNode,
  Direction,
  ExtractNodeType,
  Position,
  PositionIdentity,
  Rect,
} from './boxAst';
import { updateData } from './updateData';
import { getRect } from './box';

export function updatePosition(
  root: ExtractNodeType<BoxAst, 'root'>,
): ExtractNodeType<BoxAst, 'root'> {
  return {
    ...root,
    data: {
      ...root.data,
      position: PositionIdentity, // 変
    },
    children: root.children.reduce(
      (acc: ExtractNodeType<BoxAst, 'root'>['children'], item, idx) => {
        acc.push(calcBoxPosition2(getRect(acc[idx - 1]), item));

        return acc;
      },

      [],
    ),
  };
}

function calcBoxPosition2<T extends BoxAst>(leftRect: Rect, node: T): T {
  switch (node.type) {
    case 'root':
      return {
        ...node,
        data: {
          ...node.data,
          position: PositionIdentity,
        },
        children: node.children.reduce((acc: BoxAst[], item, idx) => {
          acc.push(calcBoxPosition2(getRect(acc[idx - 1]), item));

          return acc;
        }, []),
      };
    case 'frame':
      switch (node.boxType) {
        case 'frame':
          return {
            ...node,
            data: {
              ...node.data,
              position: PositionIdentity,
            },
            children: node.children.reduce((acc: BoxAst[], item, idx) => {
              acc.push(calcBoxPosition2(getRect(acc[idx - 1]), item));

              return acc;
            }, []),
          };
        case 'block':
          return {
            ...node,
            data: {
              ...node.data,
              position: addPositionBlock(node.data.direction, leftRect),
            },
            children: node.children.reduce((acc: BoxAst[], item, idx) => {
              acc.push(calcBoxPosition2(getRect(acc[idx - 1]), item));

              return acc;
            }, []),
          };
        case 'inline':
          return {
            ...node,
            data: {
              ...node.data,
              position: addPositionInline(node.data.direction, leftRect),
            },
            children: node.children.reduce((acc: BoxAst[], item, idx) => {
              acc.push(calcBoxPosition2(getRect(acc[idx - 1]), item));

              return acc;
            }, []),
          };
      }
    case 'fragment':
      return node;
    case 'identity':
      return node;
    case 'text':
      return updateData(node as BoxAstNode<'text'>, {
        position: addPositionInline(node.data.direction, leftRect),
      }) as T;
  }
}

export function addPositionBlock(direction: Direction, left: Rect): Position {
  switch (direction) {
    case 'horizontal-tb':
      return {
        top: left.top + left.height,
        left: 0,
      };
    case 'vertical-rl':
      return {
        top: left.top,
        left: 0,
      };
  }
}

export function addPositionInline(direction: Direction, left: Rect): Position {
  switch (direction) {
    case 'horizontal-tb':
      return {
        top: left.top,
        left: left.width + left.left,
      };
    case 'vertical-rl':
      return {
        top: left.top + left.height,
        left: left.width,
      };
  }
}
