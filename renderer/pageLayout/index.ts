import { normalize } from '@kindlize/normalize';
import {
  toBox,
  toNormalizedBoxContent,
  calcBoxPosition,
  intoSizedBox,
  getPosition,
} from './box';
import { Size, Position, BoxAst } from './boxAst';
import { getContext } from './context';

type Options = {
  pageSize: Size;
  mmPx: number;
};

export function pageLayout(
  canvas: HTMLCanvasElement,
  text: string,
  options: Options,
) {
  const ast = build(text, options);
  if (ast == null) {
    console.log('null context');
    return null;
  }
  console.log(ast);
  console.log(options);

  // canvas.width = ast.data.size.width;
  // canvas.height = ast.data.size.height;
  const ctx = canvas.getContext('2d');
  if (ctx == null) {
    console.log('null context');
    return null;
  }
  ctx.canvas.width = options.pageSize.width;
  ctx.canvas.height = options.pageSize.height;

  ctx.font = `${(options.mmPx / 4) * 9}px serif`;
  // ctx.direction = 'inherit';

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  renderToCanvas(ctx, PositionIdentity, ast);

  // ctx.save();
  return canvas.toDataURL();
}

function build(text: string, options: { mmPx: number }): BoxAst | null {
  if (global.document == null) {
    return null;
  }
  const canvas = global.document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx == null) {
    return null;
  }

  const context = getContext({
    direction: 'horizontal-tb',
    pageSize: { width: 500, height: 500 },
    canvasContext: ctx,
  });

  ctx.font = `${(options.mmPx / 4) * 9}px serif`;

  const ast = normalize(text, 'raw', {
    toHtml: false,
    direction: 'vertical',
  } as any);

  const boxAst = toBox(context, ast);

  return [toNormalizedBoxContent, intoSizedBox, calcBoxPosition].reduce(
    (acc, f) => f(acc),
    boxAst,
  );
}

function renderToCanvas(
  context: CanvasRenderingContext2D,
  parent: Position,
  node: BoxAst,
): void {
  const pos = addPosition(parent, getPosition(node));
  switch (node.type) {
    case 'root':
    case 'frame':
      return node.children.forEach((item) =>
        renderToCanvas(context, pos, item),
      );
    case 'text':
      return context.fillText(node.value, pos.left, pos.top);
  }
}

const PositionIdentity: Position = Object.freeze({ left: 0, top: 0 });

function addPosition(left: Position, right: Position): Position {
  return {
    left: left.left + right.left,
    top: left.top + right.top,
  };
}
