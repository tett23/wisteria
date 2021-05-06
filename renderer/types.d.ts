type PropType<
  F extends (...args: any) => any
> = Parameters<F>[0] extends undefined ? {} : Parameters<F>[0];

type OmitPropType<
  F extends (...props: any) => JSX.Element | null,
  K extends keyof PropType<F>
> = (props: Omit<PropType<F>, K>) => ReturnType<F>;

// type IsTuple<Tuple extends any[]> = {
//   empty: true;
//   nonEmpty: ((...p: Tuple) => any) extends (
//     p1: infer First,
//     ...p: infer Rest
//   ) => any
//     ? IsTuple<Rest>
//     : false;
//   infinite: false;
// }[Tuple extends []
//   ? 'empty'
//   : Tuple extends (infer Element)[]
//   ? Element[] extends Tuple
//     ? 'infinite'
//     : 'nonEmpty'
//   : never];

// type TupleToUnion<T> = T extends (infer E)[] ? E : never;

// type UnionPop<U> = (
//   (U extends any ? (k: (x: U) => void) => void : never) extends (
//     k: infer I,
//   ) => void
//     ? I
//     : never
// ) extends { (a: infer A): void }
//   ? A
//   : never;

// type TuplePrepend<T extends any[], E> = ((a: E, ...r: T) => void) extends (
//   ...r: infer R
// ) => void
//   ? R
//   : never;

// type UnionToTupleRecursively<Union, Result extends any[]> = {
//   1: Result;
//   0: UnionToTupleRecursively<
//     Exclude<Union, UnionPop<Union>>,
//     TuplePrepend<Result, UnionPop<Union>>
//   >;
// }[[Union] extends [never] ? 1 : 0];

// type UnionToTuple<U> = UnionToTupleRecursively<U, []>;

// type UnionToTupleWithMapRecursively<
//   Union extends string | number | symbol,
//   Map extends { [k in Union]: any },
//   Result extends any[]
// > = {
//   1: Result;
//   0: UnionToTupleWithMapRecursively<
//     Exclude<Union, UnionPop<Union>>,
//     Map,
//     TuplePrepend<Result, Map[UnionPop<Union>]>
//   >;
// }[[Union] extends [never] ? 1 : 0];

// type UnionToTupleWithMap<
//   U extends string | number | symbol,
//   Map extends { [k in any]: any }
// > = UnionToTupleWithMapRecursively<U, Map, []>;

// type TupleMap<
//   T extends any[],
//   Map extends { [k in any]: any }
// > = UnionToTupleWithMap<TupleToUnion<T>, Map>;

// type Left<T extends [any, any]> = T extends [any, infer U] ? U : never;

// type B<T> = T extends []
//   ? []
//   : T extends [StatePair<infer HeadT>]
//   ? StatePair<HeadT>
//   : T extends [infer Head, ...Array<infer Tail>]
//   ? Head extends StatePair<infer HeadT>
//     ? StatePair<HeadT> | B<Tail>
//     : never
//   : never;

// type X<T> = T[number];
// type Y<T extends Array<any>> = T extends Array<StatePair<infer U>> ? U : never;
// type Y2 = Y<typeof InitialStates>;
// const y2: Y2 = InitialStates;
// type Z<T, U> = Array<StatePair<T> | StatePair<U>>;

// type A<T> = Array<StatePair<T>>;

// // type Push<T extends any[], V> = [...T, V];
// // type IntoTuple<T> = T extends infer U | any ? Push<>;
// type YY<T> = T extends Array<infer U> ? U : never;
// type ZZZ<T> = T extends YY<infer U> ? UnionToTuple<U> : never;
// const zzz: ZZZ<typeof InitialStates> = InitialStates;

declare module 'electron-devtools-installer';

namespace NodeJS {
  import { ApiActions, ApiRequest, ApiResponse } from 'messages';

  interface Global {
    api: {
      message: <T extends ApiActions>(
        action: T,
        arg: ApiRequest<T>,
      ) => Promise<ApiResponse<T>>;
      on: (channel: string, callback: (event: any, argv: any) => void) => void;
    };
  }
}
