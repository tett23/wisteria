import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import { Properties } from 'csstype';

type ResizeDirection = 'vertical' | 'horizontal';

type ResizableProps = {
  direction: ResizeDirection;
  children: [React.ReactElement, React.ReactElement];
  style?: CSSProperties;
  defaultSize?: Properties['width'];
};

export function Resizable({
  direction,
  children: [a, b],
  style,
  defaultSize,
}: ResizableProps) {
  const [value, onPointerDown] = useProps(direction);
  const dirProp = direction === 'horizontal' ? 'height' : 'width';

  return (
    <div style={style}>
      {React.cloneElement(a, {
        style: { [dirProp]: value ?? defaultSize },
      })}
      <ResizeHandle
        direction={direction}
        onPointerDown={onPointerDown}
      ></ResizeHandle>
      {React.cloneElement(b, {
        style: { [dirProp]: `calc(100% - ${value ?? defaultSize}px)` },
      })}
    </div>
  );
}

function useProps(direction: ResizeDirection) {
  const [value, setValue] = useState<number | undefined>(undefined);
  const [mouseDown, setMouseDown] = useState(false);
  const onPointerDown = useCallback(() => {
    setMouseDown(true);
  }, []);
  const onPointerUp = useCallback(() => {
    setMouseDown(false);
  }, []);
  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!mouseDown) {
        return;
      }

      const newValue = direction === 'horizontal' ? e.clientY : e.clientX;
      setValue(newValue);
    },
    [mouseDown],
  );
  useEffect(() => {
    if (!mouseDown) {
      return;
    }

    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);
    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [mouseDown]);

  return [value, onPointerDown] as const;
}

type ResizeHandleProps = {
  direction: ResizeDirection;
  onPointerDown: () => void;
};

function ResizeHandle({ direction, ...props }: ResizeHandleProps) {
  return direction === 'vertical' ? (
    <VerticalHandle {...props}></VerticalHandle>
  ) : (
    <HorizontalHandle {...props}></HorizontalHandle>
  );
}

type VerticalHandleProps = {
  onPointerDown: () => void;
};

function VerticalHandle(props: VerticalHandleProps) {
  return (
    <div
      style={{ cursor: 'ew-resize' }}
      className="h-screen bg-gray-400"
      {...props}
    >
      <div className="w-1"></div>
    </div>
  );
}

type HorizontalHandleProps = {
  onPointerDown: (e: React.MouseEvent<HTMLDivElement>) => void;
};

function HorizontalHandle(props: HorizontalHandleProps) {
  return (
    <div style={{ cursor: 'ns-resize' }} className=" bg-gray-400" {...props}>
      <div className="h-1"></div>
    </div>
  );
}
