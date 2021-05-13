import React, {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

export function Balloon({
  isOpen,
  close,
  children,
  parentRef,
}: {
  isOpen: boolean;
  close: () => void;
  children: ReactNode;
  parentRef: MutableRefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const pos = usePosition({ ref, parentRef });
  const className = useClassName();

  if (!isOpen) {
    return null;
  }

  return (
    <ClickOutside onClick={close}>
      <div
        className="absolute"
        style={{ ...(pos == null ? {} : pos) }}
        ref={ref}
      >
        <div style={{ opacity: pos == null ? 0 : 1 }}>
          <div className={className}>{children}</div>
        </div>
      </div>
    </ClickOutside>
  );
}

type usePositionArgs = {
  ref: MutableRefObject<HTMLElement | null>;
  parentRef: MutableRefObject<HTMLElement | null>;
};

function usePosition({ ref, parentRef }: usePositionArgs) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  useEffect(() => {
    if (ref.current == null) {
      return;
    }
    if (parentRef.current == null) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const parentRect = parentRef.current.getBoundingClientRect();
    const left = Math.max(
      0,
      parentRect.left + parentRect.width / 2 + rect.width * -0.5,
    );
    const top = Math.max(0, parentRect.top - rect.height);

    setPos({ left, top });
  }, [ref.current, parentRef.current]);

  return pos;
}

function useClassName() {
  const className = classNames(
    'border rounded-md',
    'shadow',
    'bg-black bg-opacity-75',
    'backdrop-filter backdrop-blur-sm',
    'text-gray-300',
    'divide-y',
    'cursor-default',
  );

  return className;
}

export type BalloonMenuPropsOmitChildren = Omit<
  PropType<typeof BalloonMenu>,
  'children'
>;

export function BalloonMenu({
  children,
  ...props
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  const onClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    props.onClick();
  }, []);

  // TODO: disabledの見た目実装する
  return (
    <div
      className="px-2 py-1 hover:bg-gray-500 cursor-pointer select-none"
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function ClickOutside({
  children,
  ...props
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  const dimension = {
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const onClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    props.onClick();
  }, []);

  return (
    <div className="fixed" style={{ ...dimension }} onClick={onClick}>
      {children}
    </div>
  );
}
