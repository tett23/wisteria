import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useBalloon } from 'hooks/useBalloon';
import { useMessageRequester } from 'hooks/useMessageRequester';
import { useCurrentDirectory } from 'modules/fileView/useCurrentDirectory';
import { useReloadFileView } from 'modules/fileView/useReloadFileView';
import React, { useCallback, useRef } from 'react';

type FileMenuProps = {
  path: string;
};

export function FileMenu(props: FileMenuProps) {
  const { Balloon, BalloonMenu, ref, onClick, onClickRemove } = useFileMenu(
    props,
  );

  return (
    <div>
      <div className="cursor-pointer" onClick={onClick} ref={ref}>
        <FontAwesomeIcon icon={faEllipsisV} className="fa-fw"></FontAwesomeIcon>
      </div>
      <Balloon parentRef={ref}>
        <BalloonMenu onClick={onClickRemove}>Remove</BalloonMenu>
        <BalloonMenu onClick={() => {}}>
          fugafugaaaaaaaaaaaaaaaaaaaaaaaaaa
        </BalloonMenu>
        <BalloonMenu onClick={() => {}}>fugafuga</BalloonMenu>
      </Balloon>
    </div>
  );
}

function useFileMenu({ path }: FileMenuProps) {
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

  return {
    Balloon,
    BalloonMenu,
    onClick,
    ref,
    onClickRemove,
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
