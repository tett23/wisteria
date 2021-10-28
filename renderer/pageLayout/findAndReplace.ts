import { BoxAst, BoxAstNode, Parent, isParent } from './boxAst';
import { boxscript } from './boxscript';

type Finder =
  | ((node: BoxAst, parent: BoxAst & Parent<BoxAst>) => boolean)
  | BoxAst['type'];
type Replacer = Replacer1<BoxAst, BoxAst> | Replacer2<BoxAst>;
type Replacer1<T extends BoxAst, U extends BoxAst> = (
  node: T,
  idx: number,
  parent: ReplaceParent,
) => U;
type Replacer2<T extends BoxAst> = T;

type ReplaceParent =
  | Exclude<BoxAst & Parent<BoxAst>, { type: 'root' }>
  | BoxAstNode<'identity'>;

export function boxAstUtilFindAndReplace<
  T extends BoxAst & Parent<BoxAst>,
  U extends BoxAst['type'],
  R extends BoxAst
>(node: T, find: U, replace: R): T;

export function boxAstUtilFindAndReplace<
  T extends BoxAst,
  U extends BoxAst['type']
>(node: T, find: U, replace: Replacer1<BoxAstNode<U>, any>): T;

export function boxAstUtilFindAndReplace<
  T extends BoxAst,
  U extends BoxAst['type'],
  F extends BoxAst
>(
  node: T,
  find: (node: BoxAst, parent: BoxAst & Parent<BoxAst>) => boolean,
  replace: Replacer1<F, any>,
): T;

export function boxAstUtilFindAndReplace<T extends BoxAst & Parent<BoxAst>>(
  node: T,
  find: Finder,
  replace: Replacer,
): T {
  return transofrm(node, 0, boxscript('identity'), node, find, replace);
}

function transofrm<T extends BoxAst & Parent<BoxAst>>(
  parent: T,
  targetIdx: number,
  replaceParent: ReplaceParent,
  targetNode: BoxAst,
  find: Finder,
  replace: Replacer,
): T {
  if (
    typeof find === 'string' &&
    typeof replace === 'object' &&
    targetNode.type === find
  ) {
    return replace as T;
  }
  if (
    typeof find === 'string' &&
    typeof replace === 'function' &&
    targetNode.type === find
  ) {
    return replace(targetNode, targetIdx, replaceParent) as T;
  }
  if (
    typeof find === 'function' &&
    typeof replace === 'object' &&
    find(targetNode, parent)
  ) {
  }
  if (
    typeof find === 'function' &&
    typeof replace === 'function' &&
    find(targetNode, parent)
  ) {
    return replace(targetNode, targetIdx, replaceParent) as T;
  }

  if (isParent(targetNode)) {
    return {
      ...targetNode,
      children: targetNode.children.map((item, idx) =>
        transofrm(
          targetNode,
          idx,
          targetNode as ReplaceParent,
          item,
          find,
          replace,
        ),
      ),
    } as T;
  }

  return targetNode as T; //NOTE: 型が変
}
