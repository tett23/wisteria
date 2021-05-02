import { createElement, useCallback, useState } from 'react';

export type FoldableProps = {
  isOpen?: boolean;
  unfold: (props: any) => JSX.Element;
  fold: (props: any) => JSX.Element;
  foldContent: (props: any) => JSX.Element;
  onClick?: () => void;
};
export function Foldable({
  fold,
  unfold,
  foldContent,
  ...props
}: FoldableProps) {
  const [isOpen, setIsOpen] = useState(props.isOpen ?? false);
  const onClick = useCallback(() => {
    setIsOpen(!isOpen);

    if (props.onClick == null) {
      return;
    }

    props.onClick();
  }, [isOpen]);

  return (
    <div>
      <div className="cursor-pointer" onClick={onClick}>
        {isOpen ? createElement(unfold) : createElement(fold)}
      </div>
      {isOpen && createElement(foldContent)}
    </div>
  );
}
