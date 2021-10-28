import { BoxAst, DeepExclude, isParent } from './boxAst';

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
