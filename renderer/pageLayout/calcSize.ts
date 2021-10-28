import { addSize } from './addSize';
import { BoxAst, Direction, Size, SizeIdentity } from './boxAst';

export const calcSize = (direction: Direction) => (node: BoxAst): Size => {
  switch (node.type) {
    case 'root':
      return { ...node.data.size };
    case 'fragment':
      return node.children
        .map(calcSize(direction))
        .reduce(addSize(direction), SizeIdentity);
    case 'identity':
      return SizeIdentity;
    case 'frame': {
      switch (node.data.overflow) {
        case 'hidden':
          return node.data.size;
        case 'resize':
          return node.children
            .map(calcSize(direction))
            .reduce(addSize(direction), SizeIdentity);
      }
    }
    case 'text':
      return node.data.size;
  }
};
