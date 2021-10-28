import { BoxAst, BoxAstNode, PositionIdentity, SizeIdentity } from './boxAst';

export function boxscript<T extends BoxAst['type'] | 'inline' | 'block'>(
  nodeType: T,
  ...args: any
): BoxAstNode<T> {
  const [a, b] = args;

  const data = (() => {
    if (typeof a === 'object') {
      return a;
    }
    if (typeof b === 'object') {
      return b;
    }

    return {};
  })();
  const children = (() => {
    if (Array.isArray(a)) {
      return a;
    }
    if (Array.isArray(b)) {
      return b;
    }

    return [];
  })();

  switch (nodeType) {
    case 'root':
      return {
        type: 'root',
        data: {
          ...{
            position: PositionIdentity,
            size: SizeIdentity,
            direction: 'horizontal-tb',
          },
          ...data,
        },
        children,
      } as BoxAstNode<T>;
    case 'fragment':
      return {
        type: 'fragment',
        data,
        children,
      } as BoxAstNode<T>;
    case 'identity':
      return { type: 'identity', data } as BoxAstNode<T>;
    case 'frame':
      return {
        type: 'frame',
        boxType: 'frame',
        data: {
          ...{
            position: PositionIdentity,
            size: SizeIdentity,
            direction: 'horizontal-tb',
            overflow: 'hidden',
          },
          ...data,
        },
        children,
      } as BoxAstNode<T>;
    case 'inline':
      return {
        type: 'frame',
        boxType: 'inline',
        data: {
          ...{
            position: PositionIdentity,
            size: SizeIdentity,
            direction: 'horizontal-tb',
            overflow: 'resize',
          },
          ...data,
        },
        children,
      } as BoxAstNode<T>;
    case 'block':
      return {
        type: 'frame',
        boxType: 'block',
        data: {
          ...{
            position: PositionIdentity,
            size: SizeIdentity,
            direction: 'horizontal-tb',
            overflow: 'resize',
          },
          ...data,
        },
        children,
      } as BoxAstNode<T>;
    case 'text':
      return {
        type: 'text',
        data: {
          ...{
            position: PositionIdentity,
            size: SizeIdentity,
            direction: 'horizontal-tb',
          },
          ...data,
        },
        value: children as any,
      } as BoxAstNode<T>;
    default:
      throw new Error();
  }
}

export const b = boxscript;
