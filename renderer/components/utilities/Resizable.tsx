import React, {
  CSSProperties,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type ResizeDirection = 'vertical' | 'horizontal';

type ResizableProps = {
  direction: ResizeDirection;
  children: [React.ReactElement, React.ReactElement];
  style?: CSSProperties;
  className?: string;
  defaultSize?: string | number;
};

export function Resizable({
  direction,
  children: [a, b],
  style,
  className,
  defaultSize,
}: ResizableProps) {
  const {
    sizes: [aSize, bSize],
    ref,
    onPointerDown,
  } = useSize({ direction, defaultSize });

  return (
    <div className={className} style={style} ref={ref}>
      <div style={aSize}>{React.cloneElement(a)}</div>
      <ResizeHandle direction={direction} onPointerDown={onPointerDown} />
      <div className="w-full h-full" style={bSize}>
        {React.cloneElement(b)}
      </div>
    </div>
  );
}

function useSize({
  direction,
  defaultSize,
}: {
  direction: ResizeDirection;
  defaultSize: string | number | undefined;
}) {
  const [windowSize, setWindowSize] = useState({
    width: global.innerWidth,
    height: global.innerHeight,
  });
  useEffect(() => {
    const onResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      console.log({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const ref = useRef<HTMLDivElement | null>(null);
  const [value, onPointerDown] = useValue(direction, ref);
  const dir = direction === 'horizontal' ? 'height' : 'width';
  const axis = direction === 'horizontal' ? 'y' : 'x';
  const [sizes, setSizes] = useState<
    [
      { width?: number; height?: number } | undefined,
      { width?: number; height?: number } | undefined,
    ]
  >([{ [dir]: defaultSize }, { [dir]: '100%' }]);
  useEffect(() => {
    if (ref.current == null) {
      return;
    }

    const parentRect = ref.current.getBoundingClientRect();
    const aRect = ref.current.children.item(0)?.getBoundingClientRect();
    const handleRect = ref.current.children.item(1)?.getBoundingClientRect();
    if (handleRect == null || aRect == null) {
      return;
    }

    const aSize = { [dir]: aRect[dir] };
    const bSize = {
      [dir]: parentRect[dir] - aRect[dir] - handleRect[dir] - parentRect[axis],
    };

    setSizes([aSize, bSize]);
  }, [ref, windowSize.width, windowSize.height]);
  useEffect(() => {
    if (ref.current == null || value == null) {
      return;
    }

    const parentRect = ref.current.getBoundingClientRect();
    const aRect = ref.current.children.item(0)?.getBoundingClientRect();
    const handleRect = ref.current.children.item(1)?.getBoundingClientRect();
    if (handleRect == null || aRect == null) {
      return;
    }

    const aSize = { [dir]: value };
    const bSize = {
      [dir]: parentRect[dir] - value - handleRect[dir] - parentRect[axis],
    };

    setSizes([aSize, bSize]);
  }, [value, windowSize.width, windowSize.height]);

  return {
    ref,
    sizes,
    onPointerDown,
  };
}

function useValue(
  direction: ResizeDirection,
  ref: MutableRefObject<HTMLElement | null>,
) {
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
      if (!mouseDown || ref.current == null) {
        return;
      }

      const parentRect = ref.current.getBoundingClientRect();

      const newValue =
        direction === 'horizontal'
          ? e.clientY - parentRect.y
          : e.clientX - parentRect.y;
      setValue(newValue);
    },
    [mouseDown, ref],
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
