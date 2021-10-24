import { Size, Direction } from './boxAst';

export type Context = {
  toSize: (character: string) => Size;
  pageSize: Size;
  direction: Direction;
};

export function getContext(params: {
  direction: Direction;
  pageSize: Size;
  canvasContext: CanvasRenderingContext2D;
}): Context {
  return {
    direction: params.direction,
    pageSize: params.pageSize,
    toSize: toRect(params.canvasContext),
  };
}

function toRect(
  context: CanvasRenderingContext2D,
): (character: string) => Size {
  return (c: string) => b(context, c);
}

function b(context: CanvasRenderingContext2D, character: string): Size {
  const a = context.measureText(character);

  return {
    width: a.width,
    height: a.actualBoundingBoxAscent - a.actualBoundingBoxDescent,
  };
}
