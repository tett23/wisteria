import {
  BoxAst,
  BoxAstNode,
  Direction,
  ExtractNodeType,
  Position,
  PositionIdentity,
  Rect,
  Size,
  SizeIdentity,
} from './boxAst';
import { updateData } from './updateData';
import { getRect } from './box';
import { newA, A } from './newMapable';
import { calcSize } from './calcSize';
import { boxscript } from './boxscript';

export function updatePosition(
  root: ExtractNodeType<BoxAst, 'root'>,
): ExtractNodeType<BoxAst, 'root'> {
  return calcBoxPosition2(SizeIdentity, newA(root).normalize()).unwrap();
}

function calcBoxPosition2<T extends BoxAst>(leftSize: Size, node: A<T>): A<T> {
  switch (node.type()) {
    case 'root':
      return node.mapChildren<T>((item, idx, arr) => {
        return calcBoxPosition2(
          newA(boxscript('fragment', arr?.slice(0, idx))).size(
            node.direction(),
          ),
          newA(item),
        ).unwrap();
      });
    case 'frame':
      switch ((node.value as BoxAstNode<'frame'>).boxType) {
        case 'frame':
          return node
            .update({ position: PositionIdentity })
            .mapChildren((item, idx, arr) => {
              console.log(
                'size',
                // arr,
                // arr?.slice(0, idx),
                newA(boxscript('fragment', arr?.slice(0, idx))).size(
                  node.direction(),
                ),
              );
              return calcBoxPosition2(
                newA(boxscript('fragment', arr?.slice(0, idx))).size(
                  node.direction(),
                ),
                newA(item),
              ).unwrap();
            });
        case 'block':
          return node
            .update({ position: addPositionBlock(node.direction(), leftSize) })
            .mapChildren((item, idx, arr) => {
              return calcBoxPosition2(
                newA(boxscript('fragment', arr?.slice(0, idx))).size(
                  node.direction(),
                ),
                newA(item),
              ).unwrap();
            });
        case 'inline':
          return node
            .update({ position: addPositionInline(node.direction(), leftSize) })
            .mapChildren((item, idx, arr) => {
              return calcBoxPosition2(
                newA(boxscript('fragment', arr?.slice(0, idx))).size(
                  node.direction(),
                ),
                newA(item),
              ).unwrap();
            });
      }
    case 'fragment':
      return node.mapChildren((item) => {
        return calcBoxPosition2(leftSize, newA(item)).unwrap();
      });
    case 'identity':
      return node;
    case 'text':
      return node.update({
        position: addPositionInline(node.direction(), leftSize),
      });
  }
}

export function addPositionBlock(direction: Direction, left: Size): Position {
  switch (direction) {
    case 'horizontal-tb':
      return {
        top: left.height,
        left: 0,
      };
    case 'vertical-rl':
      return {
        top: left.width,
        left: 0,
      };
  }
}

export function addPositionInline(direction: Direction, left: Size): Position {
  switch (direction) {
    case 'horizontal-tb':
      return {
        top: left.height,
        left: left.width,
      };
    case 'vertical-rl':
      return {
        top: left.height,
        left: left.width,
      };
  }
}
