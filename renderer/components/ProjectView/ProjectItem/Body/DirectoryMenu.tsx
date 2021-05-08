import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useBalloon } from 'hooks/useBalloon';
import { useMessageRequester } from 'hooks/useMessageRequester';
import { useListDirectory } from 'modules/projects/useDirectory';
import { join } from 'path';
import React, { useCallback, useRef } from 'react';

type DirectoryMenuProps = {
  path: string;
};

export function DirectoryMenu(props: DirectoryMenuProps) {
  const {
    Balloon,
    BalloonMenu,
    onClick,
    onClickCreateDirectory,
    ref,
  } = useDirectoryMenu(props);

  return (
    <div>
      <div className="cursor-pointer" onClick={onClick} ref={ref}>
        <FontAwesomeIcon icon={faEllipsisV} className="fa-fw"></FontAwesomeIcon>
      </div>
      <Balloon parentRef={ref}>
        <BalloonMenu onClick={onClickCreateDirectory}>
          Create directory
        </BalloonMenu>
        <BalloonMenu onClick={() => {}}>
          fugafugaaaaaaaaaaaaaaaaaaaaaaaaaa
        </BalloonMenu>
        <BalloonMenu onClick={() => {}}>fugafuga</BalloonMenu>
      </Balloon>
    </div>
  );
}

function useDirectoryMenu({ path }: DirectoryMenuProps) {
  const { Balloon, BalloonMenu, open } = useBalloon();
  const onClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    open();
  }, []);
  const ref = useRef<HTMLDivElement>(null);
  const createDirectory = useCreateDirectory();
  const onClickCreateDirectory = useCallback(() => {
    createDirectory(path);
  }, [path]);

  return {
    Balloon,
    BalloonMenu,
    onClick,
    onClickCreateDirectory,
    ref,
  };
}

function useCreateDirectory(): (path: string) => Promise<void> {
  const requester = useMessageRequester();
  const listDirectory = useListDirectory();

  return useCallback(async (path: string) => {
    const result = await requester('createDirectory', join(path, 'Untitiled'));
    if (result instanceof Error) {
      return;
    }

    await listDirectory(path);
  }, []);
}