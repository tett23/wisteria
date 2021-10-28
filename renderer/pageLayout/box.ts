import { Ntast } from '@kindlize/normalize/lib/esm/novelText/ntast';
import {
  BoxAst,
  BoxAstNode,
  Position,
  PositionIdentity,
  Rect,
  RectIdentity,
} from './boxAst';
import { boxscript } from './boxscript';
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
