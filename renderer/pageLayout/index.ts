import { normalize } from '@kindlize/normalize';
import {
  toBox,
  toNormalizedBoxContent,
  intoRectBox,
  intoSizedBox,
} from './box';
import {
  ExtractNodeType,
  NormalizedBoxAst,
  NormalizedRectBox,
  Size,
  Position,
} from './boxAst';
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

function build(
  text: string,
  options: { mmPx: number },
): NormalizedRectBox | null {
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
  const normalizedAst: ExtractNodeType<
    NormalizedBoxAst,
    'root'
  > = toNormalizedBoxContent(boxAst);
  const sized = intoSizedBox(normalizedAst);

  return intoRectBox(sized);
}

function renderToCanvas(
  context: CanvasRenderingContext2D,
  parent: Position,
  node: NormalizedRectBox,
): void {
  const pos = addPosition(parent, node.data.rect);
  switch (node.type) {
    case 'root':
      return node.children.forEach((item) =>
        renderToCanvas(context, pos, item),
      );
    case 'frame':
      return node.children.forEach((item) =>
        renderToCanvas(context, pos, item),
      );
    case 'block':
      return node.children.forEach((item) =>
        renderToCanvas(context, pos, item),
      );
    case 'inline':
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
