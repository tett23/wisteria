export type Size = {
  width: number;
  height: number;
};

export type Position = {
  top: number;
  left: number;
};

export type Rect = Position & Size;

export type Direction = 'horizontal-tb' | 'vertical-rl';

type Root = {
  type: 'root';
  data: {
    direction: Direction;
    size: Size;
    position: Position;
  };
  children: Array<FrameFrame | Fragment | Identity>;
};

type FrameFrame = {
  type: 'frame';
  boxType: 'frame';
  data: {
    size: Size;
    position: Position;
    direction: Direction;
    overflow: 'hidden';
  };
  children: Array<FrameFrame | FrameBlock | FrameInline | Fragment | Identity>;
};

type FrameBlock = {
  type: 'frame';
  boxType: 'block';
  data: {
    size: Size;
    position: Position;
    direction: Direction;
    overflow: 'hidden' | 'resize';
  };
  children: Array<FrameInline | Fragment | Identity>;
};

type FrameInline = {
  type: 'frame';
  boxType: 'inline';
  data: {
    size: Size;
    position: Position;
    direction: Direction;
    overflow: 'hidden' | 'resize';
  };
  children: Array<Text | Fragment | Identity>;
};

type Frame = FrameFrame | FrameBlock | FrameInline;

type Text = {
  type: 'text';
  data: { direction: Direction; size: Size; position: Position };
  value: string;
};

type Fragment = {
  type: 'fragment';
  children: Array<Content>;
};

type Identity = {
  type: 'identity';
};

export type Content = Frame | Text | Fragment | Identity;

export type BoxAst = Root | Content;

export type UnwrapArray<T extends Array<any>> = T extends Array<infer U>
  ? U
  : never;

export type DeepExclude<T, U> = T extends { type: U }
  ? never
  : T extends { children: Array<any> }
  ? Omit<T, 'children'> & {
      children: DeepExclude<UnwrapArray<T['children']>, U>[];
    }
  : T;

// export type NormalizedBoxAst = DeepExclude<BoxAst, 'fragment' | 'identity'>;

export type DeepIntersection<T, U> = T extends { children: Array<any> }
  ? Omit<T, 'children'> &
      U & { children: DeepIntersection<UnwrapArray<T['children']>, U>[] }
  : T & U;

// type SizedBoxRoot = {
//   type: 'root';
//   data: {
//     direction: Direction;
//     position: Position;
//     size: Size;
//   };
// };

// type SizedBoxFrame = {
//   type: 'frame';

//   data: {
//     direction: Direction;
//     position: Position;
//     size: Size;
//     overflow:
//   };
// };

// type SizedBoxAst = Root;

// export type NormalizedSizedBox = DeepIntersection<
//   NormalizedBoxAst,
//   { data: { size: Size } }
// >;
// export type NormalizedRectBox = DeepIntersection<
//   NormalizedBoxAst,
//   { data: { rect: Rect } }
// >;

export type ExtractNodeType<
  T extends { type: string },
  U extends T['type']
> = Extract<T, { type: U }>;

// export type ExtractNormalizedBoxAst<
//   T extends NormalizedSizedBox['type']
// > = Extract<NormalizedSizedBox, { type: T }>;

export type BoxAstNode<T extends { type: string }['type']> = Extract<
  BoxAst,
  { type: T }
>;
// export type NotBoxAstNode<
//   T extends (BoxAst | NormalizedBoxAst)['type']
// > = Exclude<BoxAst | NormalizedBoxAst, { type: T }>;
// export type ExcludeBoxAstNode<
//   T extends BoxAst | NormalizedBoxAst,
//   U extends (BoxAst | NormalizedBoxAst)['type']
// > = Exclude<T, { type: U }>;

type B<T extends BoxAst> = T extends { children: infer U }
  ? { children: U }
  : never;

export function isParent<T extends BoxAst>(node: T): node is T & B<T> {
  if (node == null) {
    return false;
  }
  if (typeof node !== 'object') {
    return false;
  }

  return (
    typeof (node as any).type === 'string' &&
    Array.isArray((node as any).children)
  );
}
