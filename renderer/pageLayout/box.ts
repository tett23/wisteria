import { Ntast } from '@kindlize/normalize/lib/esm/novelText/ntast';
import {
  BoxAst,
  BoxAstNode,
  DeepExclude,
  Direction,
  ExtractNodeType,
  NormalizedBoxAst,
  NormalizedRectBox,
  NormalizedSizedBox,
  Rect,
  Size,
} from './boxAst';
import { Context } from './context';

export function toBox(context: Context, ntast: Ntast): BoxAstNode<'root'> {
  return {
    type: 'root',
    data: { direction: context.direction, size: context.pageSize },
    children: [
      {
        type: 'frame',
        data: { direction: context.direction, rect: RectIdentity },
        children: ntast.children.map((v: any) => toBox2(context, v)),
      },
    ],
  };
}

export function toBox2(context: Context, ntast: Ntast): BoxAst {
  switch (ntast.type) {
    case 'paragraph':
      return {
        type: 'block',
        data: { direction: context.direction },
        children: ntast.children.map((v: any) => toBox2(context, v)),
      };
    case 'text':
      return {
        type: 'inline',
        data: { direction: context.direction },
        children: ntast.value.split('').map((c: string) => ({
          type: 'text',
          data: { direction: context.direction, size: context.toSize(c) },
          value: c,
        })),
      };
    case 'break':
      return {
        type: 'block',
        data: { direction: context.direction },
        children: [
          {
            type: 'inline',
            data: { direction: context.direction },
            children: [
              {
                type: 'text',
                data: {
                  direction: context.direction,
                  size: context.toSize('\n'),
                },
                value: '\n',
              },
            ],
          },
        ],
      };
    default:
      return { type: 'identity' };
  }
}

function intoSize(node: BoxAst): Size {
  // return collectSize(node).reduce(addSize, SizeIdentity);
  switch (node.type) {
    case 'root':
      return { ...node.data.size };
    case 'fragment':
      return SizeIdentity;
    case 'identity':
      return SizeIdentity;
    case 'frame':
      return { width: node.data.rect.width, height: node.data.rect.height };
    case 'block': {
      const sizes = node.children.map(intoSize);
      const addHandler =
        node.data.direction === 'horizontal-tb'
          ? addSizeVertical
          : addSizeHorizontal;
      return sizes.reduce(addHandler, SizeIdentity);
    }
    case 'inline': {
      const sizes = node.children.map(intoSize);
      const addHandler =
        node.data.direction === 'horizontal-tb'
          ? addSizeHorizontal
          : addSizeVertical;
      return sizes.reduce(addHandler, SizeIdentity);
    }
    case 'text':
      return node.data.size;
  }
}

// function collectSize(node: BoxAst): Size[] {
//   switch (node.type) {
//     case 'root':
//       return node.children.flatMap(collectSize);
//     case 'fragment':
//       return [SizeIdentity];
//     case 'identity':
//       return [SizeIdentity];
//     case 'frame':
//       return node.children.flatMap(collectSize);
//     case 'block':
//       return node.children.flatMap(collectSize);
//     case 'inline':
//       return node.children.flatMap(collectSize);
//     case 'text':
//       return [node.data.size];
//   }
// }

const SizeIdentity: Size = Object.freeze({ width: 0, height: 0 });

function addSizeVertical(left: Size, right: Size): Size {
  return {
    width: Math.max(left.width, right.width),
    height: left.height + right.height,
  };
}

function addSizeHorizontal(left: Size, right: Size): Size {
  return {
    width: left.width + right.width,
    height: Math.max(left.height, right.height),
  };
}

export function toNormalizedBoxContent<T extends BoxAst>(
  node: T,
): DeepExclude<T, 'fragment' | 'identity'> {
  switch (node.type) {
    case 'root':
      return {
        ...node,
        children: node.children
          .filter((item) => item.type !== 'identity')
          .flatMap((item) =>
            item.type === 'fragment'
              ? item.children
              : toNormalizedBoxContent(item),
          ),
      } as DeepExclude<T, 'fragment' | 'identity'>;
    case 'frame':
      return {
        ...node,
        children: node.children
          .filter((item) => item.type !== 'identity')
          .flatMap((item) =>
            item.type === 'fragment'
              ? item.children
              : toNormalizedBoxContent(item),
          ),
      } as DeepExclude<T, 'fragment' | 'identity'>;
    case 'block':
      return {
        ...node,
        children: node.children
          .filter((item) => item.type !== 'identity')
          .flatMap((item) =>
            item.type === 'fragment'
              ? item.children
              : toNormalizedBoxContent(item),
          ),
      } as DeepExclude<T, 'fragment' | 'identity'>;
    case 'inline':
      return {
        ...node,
        children: node.children
          .filter((item) => item.type !== 'identity')
          .flatMap((item) =>
            item.type === 'fragment'
              ? item.children
              : toNormalizedBoxContent(item),
          ),
      } as DeepExclude<T, 'fragment' | 'identity'>;
    case 'text':
      return node as DeepExclude<T, 'fragment' | 'identity'>;
    case 'fragment':
      throw new Error();
    case 'identity':
      throw new Error();
  }
}

export function intoSizedBox(
  node: ExtractNodeType<NormalizedBoxAst, 'root'>,
): ExtractNodeType<NormalizedSizedBox, 'root'> {
  return {
    ...node,
    data: {
      ...node.data,
      size: intoSize(node),
    },
    children: node.children.map(intoSizedBox2),
  } as ExtractNodeType<NormalizedSizedBox, 'root'>;
}

export function intoSizedBox2(node: NormalizedBoxAst): NormalizedSizedBox {
  switch (node.type) {
    case 'root':
    case 'frame':
    case 'block':
    case 'inline':
      return {
        ...node,
        data: {
          ...node.data,
          size: intoSize(node),
        },
        children: node.children.map(intoSizedBox2),
      } as NormalizedSizedBox;
    case 'text':
      return node;
  }
}

export function intoRectBox(
  root: ExtractNodeType<NormalizedSizedBox, 'root'>,
): ExtractNodeType<NormalizedRectBox, 'root'> {
  return {
    ...root,
    data: {
      ...root.data,
      rect: RectIdentity, // 変
    },
    children: root.children.map((item, idx, arr) =>
      intoRectBox2(arr[idx - 1]?.data.rect ?? RectIdentity, item),
    ),
  } as ExtractNodeType<NormalizedRectBox, 'root'>;
}

export function intoRectBox2(
  leftRect: Rect,
  node: NormalizedSizedBox,
): NormalizedRectBox {
  switch (node.type) {
    case 'root':
      return {
        ...node,
        data: {
          ...node.data,
          rect: RectIdentity,
        },
        children: node.children.reduce(
          (acc: NormalizedRectBox[], item, idx) => {
            acc.push(
              intoRectBox2(acc[idx - 1]?.data.rect ?? RectIdentity, item),
            );

            return acc;
          },
          [],
        ),
      } as ExtractNodeType<NormalizedRectBox, 'root'>;
    case 'frame':
      return {
        ...node,
        data: {
          ...node.data,
          rect: RectIdentity,
        },
        children: node.children.reduce(
          (acc: NormalizedRectBox[], item, idx) => {
            acc.push(
              intoRectBox2(acc[idx - 1]?.data.rect ?? RectIdentity, item),
            );

            return acc;
          },
          [],
        ),
      } as ExtractNodeType<NormalizedRectBox, 'frame'>;
    case 'block':
      return {
        ...node,
        data: {
          ...node.data,
          // rect: RectIdentity,
          rect: addRectBlock(node.data.direction, leftRect, node.data.size),
        },
        children: node.children.reduce(
          (acc: NormalizedRectBox[], item, idx) => {
            acc.push(
              intoRectBox2(acc[idx - 1]?.data.rect ?? RectIdentity, item),
            );

            return acc;
          },
          [],
        ),
      } as ExtractNodeType<NormalizedRectBox, 'block'>;
    case 'inline':
      return {
        ...node,
        data: {
          ...node.data,
          rect: RectIdentity,
          // rect: addRectInline(node.data.direction, leftRect, node.data.size),
        },
        children: node.children.reduce(
          (acc: NormalizedRectBox[], item, idx) => {
            acc.push(
              intoRectBox2(acc[idx - 1]?.data.rect ?? RectIdentity, item),
            );

            return acc;
          },
          [],
        ),
      } as ExtractNodeType<NormalizedRectBox, 'inline'>;
    case 'text':
      return {
        ...node,
        data: {
          ...node.data,
          rect: addRectInline(node.data.direction, leftRect, node.data.size),
        },
      } as ExtractNodeType<NormalizedRectBox, 'text'>;
  }
}

const RectIdentity: Rect = Object.freeze({
  top: 0,
  left: 0,
  width: 0,
  height: 0,
});

function addRectBlock(direction: Direction, left: Rect, right: Size): Rect {
  switch (direction) {
    case 'horizontal-tb':
      return {
        top: left.top + left.height,
        left: 0,
        width: right.width,
        height: right.height,
      };
    case 'vertical-rl':
      return {
        top: left.top,
        left: 0,
        width: right.width,
        height: right.height,
      };
  }
}

function addRectInline(direction: Direction, left: Rect, right: Size): Rect {
  switch (direction) {
    case 'horizontal-tb':
      return {
        top: left.top,
        left: left.width + left.left,
        width: right.width,
        height: right.height,
      };
    case 'vertical-rl':
      return {
        top: left.top + left.height,
        left: left.width,
        width: right.width,
        height: right.height,
      };
  }
}
