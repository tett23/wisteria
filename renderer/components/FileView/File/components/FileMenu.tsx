import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BalloonType, useBalloon } from 'hooks/useBalloon';
import { useMessageRequester } from 'hooks/useMessageRequester';
import { fileViewFileStates } from 'modules/fileView';
import { useCurrentDirectory } from 'modules/fileView/useCurrentDirectory';
import { useReloadFileView } from 'modules/fileView/useReloadFileView';
import React, { useCallback, useRef } from 'react';
import { useSetRecoilState } from 'recoil';

type FileMenuProps = {
  path: string;
};

export function FileMenu(props: FileMenuProps) {
  const {
    Balloon,
    BalloonMenu,
    ref,
    onClick,
    onClickRemove,
    onClickRename,
  } = useFileMenu(props);

  return (
    <div>
      <div className="cursor-pointer" onClick={onClick} ref={ref}>
        <FontAwesomeIcon icon={faEllipsisV} className="fa-fw"></FontAwesomeIcon>
      </div>
      <Balloon parentRef={ref}>
        <BalloonMenu onClick={onClickRemove}>Remove</BalloonMenu>
        <BalloonMenu onClick={onClickRename}>Rename</BalloonMenu>
        <BalloonMenu onClick={() => {}}>fugafuga</BalloonMenu>
      </Balloon>
    </div>
  );
}

function useFileMenu({
  path,
}: FileMenuProps): {
  Balloon: BalloonType['Balloon'];
  BalloonMenu: BalloonType['BalloonMenu'];
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  ref: React.RefObject<HTMLDivElement>;
  onClickRemove: () => void;
  onClickRename: () => void;
} {
  const { Balloon, BalloonMenu, open } = useBalloon();
  const onClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    open();
  }, []);
  const ref = useRef<HTMLDivElement>(null);
  const removeFile = useRemoveFile();
  const onClickRemove = useCallback(() => {
    removeFile(path);
  }, []);
  const renameFile = useRenameFile();
  const onClickRename = useCallback(() => {
    renameFile(path);
  }, []);

  return {
    Balloon,
    BalloonMenu,
    onClick,
    ref,
    onClickRemove,
    onClickRename,
  };
}

function useRemoveFile() {
  const requester = useMessageRequester();
  const currentDirectory = useCurrentDirectory();
  const reloadFileView = useReloadFileView();

  return useCallback(async (path: string) => {
    const result = await requester('deleteFile', path);
    if (result instanceof Error) {
      return;
    }
    if (currentDirectory == null) {
      return;
    }

    reloadFileView();
  }, []);
}

function useRenameFile() {
  const setFileStates = useSetRecoilState(fileViewFileStates);

  return useCallback(async (path: string) => {
    setFileStates((current) => ({ ...current, [path]: 'renaming' }));
  }, []);
}
