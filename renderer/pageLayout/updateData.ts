import { BoxAst } from './boxAst';

export function updateData<T extends BoxAst>(
  node: T,
  data: Partial<T['data']>,
): T {
  return { ...node, data: { ...node.data, ...data } };
}
