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
  };
  children: Array<Frame | Fragment | Identity>;
};

type Frame = {
  type: 'frame';
  data: {
    rect: Rect;
    direction: Direction;
  };
  children: Array<Block | Fragment | Identity>;
};

type Block = {
  type: 'block';
  data: {
    direction: Direction;
  };
  children: Array<Inline | Fragment | Identity>;
};

type Inline = {
  type: 'inline';
  data: {
    direction: Direction;
  };
  children: Array<Text | Fragment | Identity>;
};

type Text = {
  type: 'text';
  data: { direction: Direction; size: Size };
  value: string;
};

type Fragment = {
  type: 'fragment';
  children: Array<Content>;
};

type Identity = {
  type: 'identity';
};

export type Content = Frame | Block | Inline | Text | Fragment | Identity;

export type BoxAst = Root | Content;

type UnwrapArray<T extends Array<any>> = T extends Array<infer U> ? U : never;

export type DeepExclude<T, U> = T extends { type: U }
  ? never
  : T extends { children: Array<any> }
  ? Omit<T, 'children'> & {
      children: DeepExclude<UnwrapArray<T['children']>, U>[];
    }
  : T;

export type NormalizedBoxAst = DeepExclude<BoxAst, 'fragment' | 'identity'>;

export type DeepIntersection<T, U> = T extends { children: Array<any> }
  ? Omit<T, 'children'> &
      U & { children: DeepIntersection<UnwrapArray<T['children']>, U>[] }
  : T & U;

export type NormalizedSizedBox = DeepIntersection<
  NormalizedBoxAst,
  { data: { size: Size } }
>;
export type NormalizedRectBox = DeepIntersection<
  NormalizedBoxAst,
  { data: { rect: Rect } }
>;

export type ExtractNodeType<
  T extends BoxAst | NormalizedBoxAst | NormalizedSizedBox | NormalizedRectBox,
  U extends T['type']
> = Extract<T, { type: U }>;

export type ExtractNormalizedBoxAst<
  T extends NormalizedSizedBox['type']
> = Extract<NormalizedSizedBox, { type: T }>;

export type BoxAstNode<T extends (BoxAst | NormalizedBoxAst)['type']> = Extract<
  BoxAst | NormalizedBoxAst,
  { type: T }
>;
export type NotBoxAstNode<
  T extends (BoxAst | NormalizedBoxAst)['type']
> = Exclude<BoxAst | NormalizedBoxAst, { type: T }>;
export type ExcludeBoxAstNode<
  T extends BoxAst | NormalizedBoxAst,
  U extends (BoxAst | NormalizedBoxAst)['type']
> = Exclude<T, { type: U }>;
