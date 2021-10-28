import { Direction, Size } from './boxAst';

export const addSize = (dir: Direction) => (left: Size, right: Size): Size => {
  switch (dir) {
    case 'vertical-rl':
      return {
        width: Math.max(left.width, right.width),
        height: left.height + right.height,
      };
    case 'horizontal-tb':
      return {
        width: left.width + right.width,
        height: Math.max(left.height, right.height),
      };
  }
};
