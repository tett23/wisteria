import {
  BoxAst,
  BoxAstNode,
  Direction,
  DirectionDefault,
  IdentityNode,
  isParent,
  Size,
  UnwrapArray,
} from './boxAst';
import { boxscript } from './boxscript';
import { calcSize } from './calcSize';
import { toNormalizedBoxContent } from './toNormalizedBoxContent';
import { addPositionInline } from './updatePosition';

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

export type LookupChildren<T extends BoxAst> = T extends { children: any[] }
  ? UnwrapArray<T['children']>
  : BoxAstNode<'identity'>;

// type ReduceF<T extends BoxAst, U> = (
//   init: U,
//   item: LookupChildren<T>,
//   idx?: number,
//   arr?: LookupChildren<T>,
// ) => Mappable<U>;

export type A<T extends BoxAst> = Omit<Mappable<T>, 'map'> & {
  type: () => BoxAst['type'];
  map: <U extends BoxAst>(f: (item: T) => U) => A<U>;
  mapChildren: <U extends BoxAst>(
    f: (
      item: LookupChildren<T>,
      idx?: number,
      arr?: LookupChildren<T>[],
    ) => LookupChildren<U>,
  ) => A<T>;
  data: () => T['data'];
  computePosition: (direction: Direction) => A<T>;
  // reduce: <U>(f: ReduceF<T, any>, init: U) => U;
  push: (a: LookupChildren<T>) => A<T>;
  direction: () => Direction;
  last: () => A<LookupChildren<T> | BoxAstNode<'identity'>>;
  size: (direction: Direction) => Size;
  update: (params: Partial<T['data']>) => A<T>;
  normalize: () => A<T>;
  // children: () => A<BoxAst>;
};

export function newA<T extends BoxAst>(node: T): A<T> {
  return {
    value: node,
    map: <U extends BoxAst>(f: (a: T) => U): A<U> => newA(f(node)),
    normalize: () => {
      return newA(toNormalizedBoxContent(node));
    },
    type: () => node.type,
    data: () => node.data,
    update: (params: Partial<T['data']>) => {
      return newA({ ...node, data: { ...node.data, ...params } });
    },
    mapChildren: <U extends BoxAst>(
      f: (
        item: LookupChildren<T>,
        idx?: number,
        arr?: LookupChildren<T>[],
      ) => LookupChildren<U>,
    ): A<T> => {
      if (node.type === 'text' || node.type === 'identity') {
        return newA(node) as any;
      }

      return newA({
        ...node,
        children: node.children.map((a, idx, arr) => f(a, idx, arr)),
      }) as any;
    },
    computePosition: (direction: Direction) => {
      return newA(node);
    },
    // reduce: (f, init) => {
    //   if (node.type === 'text' || node.type === 'identity') {
    //     return newMapable(IdentityNode)
    //   }
    //   if(!isParent(node)){
    //     return newMappable(IdentityNode)
    //   }

    //   return node.children.reduce(f, init)
    // },
    unwrap: () => node,
    push: (newNode: LookupChildren<T>) =>
      (newA(
        boxscript(node.type, node.data, [
          ...((node as any).children ?? []),
          newNode,
        ]),
      ) as any) as A<T>,
    size: (direction: Direction) => calcSize(direction)(node),
    direction: () => node.data.direction ?? DirectionDefault,
    last: (): A<LookupChildren<T> | BoxAstNode<'identity'>> => {
      if (node.type === 'identity') {
        return newA(IdentityNode);
      }
      if (node.type === 'text') {
        return newA(IdentityNode);
      }

      const lastNode: LookupChildren<T> =
        node.children[node.children.length - 1] ?? (IdentityNode as any);

      return newA(lastNode);
    },
    // children: () => {
    //   if (node.type === 'identity') {
    //     return newA(IdentityNode);
    //   }
    //   if (node.type === 'text') {
    //     return newA(IdentityNode);
    //   }

    //   const lastNode = node.children[node.children.length - 1] ?? IdentityNode;

    //   return newA(lastNode);
    // },
  };
}
