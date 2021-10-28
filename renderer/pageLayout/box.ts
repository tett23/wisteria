import { Ntast } from '@kindlize/normalize/lib/esm/novelText/ntast';
import {
  BoxAst,
  BoxAstNode,
  DeepExclude,
  Direction,
  ExtractNodeType,
  isParent,
  Position,
  PositionIdentity,
  Rect,
  RectIdentity,
} from './boxAst';
import { boxscript } from './boxscript';
import { calcSize } from './calcSize';
import { Context } from './context';

export function toBox(context: Context, ntast: Ntast): BoxAstNode<'root'> {
  return boxscript(
    'root',
    {
      direction: context.direction,
      size: context.pageSize,
      position: PositionIdentity,
    },
    [
      boxscript(
        'frame',
        {
          direction: context.direction,
          size: context.pageSize,
          overflow: 'hidden',
        },
        ntast.children.map((v: any) => toBox2(context, v)),
      ),
    ],
  );
}

export function toBox2(context: Context, node: Ntast): BoxAst {
  switch (node.type) {
    case 'paragraph':
      return boxscript(
        'block',
        { direction: context.direction },
        node.children.map((v: any) => toBox2(context, v)),
      );
    case 'text':
      return boxscript(
        'inline',
        { direction: context.direction },
        node.value
          .split('')
          .map((c: string) =>
            boxscript(
              'text',
              { direction: context.direction, size: context.toSize(c) },
              c,
            ),
          ),
      );
    case 'break':
      return boxscript('block', { direction: context.direction }, [
        boxscript('inline', { direction: context.direction }, [
          boxscript(
            'text',
            { direction: context.direction, size: context.toSize('\n') },
            '\n',
          ),
        ]),
      ]);
    default:
      console.warn(node);
      return boxscript('identity');
  }
}

type Mappable<T> = {
  value: T;
  map: <U>(f: (a: T) => U) => Mappable<U>;
  unwrap: () => T;
};

export function newMapable<T>(value: T): Mappable<T> {
  return {
    value,
    map: <U>(f: (a: T) => U): Mappable<U> => newMapable(f(value)),
    unwrap: () => value,
  };
}

export function toNormalizedBoxContent<T extends BoxAst>(
  node: T,
): DeepExclude<T, 'fragment' | 'identity'> {
  return joinFragment(filterIdentity(node)) as DeepExclude<
    T,
    'fragment' | 'identity'
  >;
}

function filterIdentity<T extends BoxAst>(node: T): DeepExclude<T, 'identity'> {
  if (!isParent(node)) {
    return node as DeepExclude<T, 'identity'>;
  }

  return ({
    ...node,
    children: node.children
      .filter(
        <U extends BoxAst>(item: U): item is Exclude<U, { type: 'identity' }> =>
          item.type !== 'identity',
      )
      .map(filterIdentity),
  } as any) as DeepExclude<T, 'identity'>;
}

function joinFragment<T extends BoxAst>(node: T): DeepExclude<T, 'fragment'> {
  if (!isParent(node)) {
    return node as DeepExclude<T, 'fragment'>;
  }

  return ({
    ...node,
    children: node.children
      .filter((a) => a)
      .flatMap((item) => (item.type === 'fragment' ? item.children : item))
      .map(joinFragment),
  } as any) as DeepExclude<T, 'fragment'>;
}

export function intoSizedBox(
  node: ExtractNodeType<BoxAst, 'root'>,
): ExtractNodeType<BoxAst, 'root'> {
  return {
    ...node,
    data: {
      ...node.data,
      size: calcSize(node.data.direction)(node),
    },
    children: node.children.map(intoSizedBox2),
  };
}

export function intoSizedBox2<T extends BoxAst>(node: T): T {
  switch (node.type) {
    case 'root':
    case 'frame':
      return {
        ...node,
        data: {
          ...node.data,
          size: calcSize(node.data.direction)(node),
        },
        children: node.children.map(intoSizedBox2),
      };
    case 'identity':
      return node;
    case 'fragment':
      return node;
    case 'text':
      return node;
  }
}

export function calcBoxPosition(
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

export function calcBoxPosition2<T extends BoxAst>(leftRect: Rect, node: T): T {
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
      return {
        ...node,
        data: {
          ...node.data,
          position: addPositionInline(node.data.direction, leftRect),
        },
      };
  }
}

export function getRect(node: BoxAst | null | undefined): Rect {
  if (node == null) {
    return RectIdentity;
  }
  if (node.type === 'identity' || node.type === 'fragment') {
    return RectIdentity;
  }

  return { ...node.data.position, ...node.data.size };
}

export function getPosition(node: BoxAst | null | undefined): Position {
  if (node == null) {
    return PositionIdentity;
  }
  if (node.type === 'fragment' || node.type === 'identity') {
    return PositionIdentity;
  }

  return node.data.position;
}

function addPositionBlock(direction: Direction, left: Rect): Position {
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
