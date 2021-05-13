import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useBalloon } from 'hooks/useBalloon';
import { BalloonMenuPropsOmitChildren } from 'hooks/useBalloon/Balloon';
import { useMessageRequester } from 'hooks/useMessageRequester';
import { projectDirectoryStates } from 'modules/projects';
import { useIsProjectRoot } from 'modules/projects/useIsProjectRoot';
import { useListDirectory } from 'modules/projects/useDirectory';
import { join, dirname } from 'path';
import React, { useCallback, useRef } from 'react';
import { useSetRecoilState } from 'recoil';

type DirectoryMenuProps = {
  path: string;
};

export function DirectoryMenu(props: DirectoryMenuProps) {
  const {
    Balloon,
    BalloonMenu,
    onClick,
    create,
    remove,
    rename,
    ref,
  } = useDirectoryMenu(props);

  return (
    <div>
      <div className="cursor-pointer" onClick={onClick} ref={ref}>
        <FontAwesomeIcon icon={faEllipsisV} className="fa-fw"></FontAwesomeIcon>
      </div>
      <Balloon parentRef={ref}>
        <BalloonMenu {...create}>Create directory</BalloonMenu>
        <BalloonMenu {...remove}>Remove directory</BalloonMenu>
        <BalloonMenu {...rename}>Rename directory</BalloonMenu>
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
  const create = useCreateDirectory(path);
  const remove = useRemoveDirectory(path);
  const rename = useRenameDirectory(path);

  return {
    Balloon,
    BalloonMenu,
    onClick,
    create,
    remove,
    rename,
    ref,
  };
}

function useCreateDirectory(path: string): BalloonMenuPropsOmitChildren {
  const requester = useMessageRequester();
  const listDirectory = useListDirectory();
  const onClick = useCallback(async () => {
    const result = await requester('createDirectory', join(path, 'Untitiled'));
    if (result instanceof Error) {
      return;
    }

    await listDirectory(path);
  }, []);

  return {
    onClick,
  };
}

function useRemoveDirectory(path: string): BalloonMenuPropsOmitChildren {
  const requester = useMessageRequester();
  const listDirectory = useListDirectory();
  const onClick = useCallback(async () => {
    const result = await requester('removeDirectory', path);
    if (result instanceof Error) {
      return;
    }

    await listDirectory(dirname(path));
  }, []);

  return {
    onClick,
  };
}

function useRenameDirectory(path: string): BalloonMenuPropsOmitChildren {
  const setDirectoryStates = useSetRecoilState(projectDirectoryStates);
  const onClick = useCallback(async () => {
    setDirectoryStates((current) => ({ ...current, [path]: 'renaming' }));
  }, [path]);
  const disabled = useIsProjectRoot(path);

  return {
    onClick,
    disabled,
  };
}
