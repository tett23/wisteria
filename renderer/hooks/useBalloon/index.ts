import React, { useCallback, useState } from 'react';
import { Balloon, BalloonMenu } from './Balloon';

export type BalloonType = {
  Balloon: OmitPropType<typeof Balloon, 'close' | 'isOpen'>;
  BalloonMenu: typeof BalloonMenu;
  close: () => void;
  open: () => void;
};

export function useBalloon(): BalloonType {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);
  const BalloonWrapper = useCallback(
    (props: PropType<BalloonType['Balloon']>) => {
      return React.createElement(Balloon, { ...props, isOpen, open, close });
    },
    [isOpen],
  );
  const BalloonMenuWrapper = useCallback(
    (props: PropType<BalloonType['BalloonMenu']>) => {
      return React.createElement(BalloonMenu, {
        ...props,
        onClick: () => {
          props.onClick();
          close();
        },
      });
    },
    [isOpen],
  );

  return {
    Balloon: BalloonWrapper,
    BalloonMenu: BalloonMenuWrapper,
    close,
    open,
  };
}
