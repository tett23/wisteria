import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { useCallback } from 'react';
import { useMessageRequester } from 'hooks/useMessageRequester';
import { useRecoilValue } from 'recoil';
import { join } from 'path';
import { fileViewSelectedDirectory } from 'modules/fileView';
import { useReloadFileView } from 'modules/fileView/useReloadFileView';

export function FileListHeader() {
  return (
    <div className="flex justify-between items-center h-10 px-2 py-1 border-b">
      <div className="w-full">
        <input
          type="text"
          className="outline-none border rounded px-1 w-full text-gray-600"
          placeholder="検索"
        />
      </div>
      <div className="ml-2">
        <AddFileButton></AddFileButton>
      </div>
    </div>
  );
}

function AddFileButton() {
  const { onClick } = useOnClickAddFile();

  return (
    <span className="cursor-pointer text-gray-600" onClick={onClick}>
      <FontAwesomeIcon icon={faFile} className="fa-fw" />
    </span>
  );
}

function useOnClickAddFile() {
  const requester = useMessageRequester();
  const selectedDirectory = useRecoilValue(fileViewSelectedDirectory);
  const reloadFileView = useReloadFileView();

  const onClick = useCallback(async () => {
    if (selectedDirectory == null) {
      return;
    }

    const file = {
      path: join(selectedDirectory, 'Untitled.txt'),
      body: '',
    };

    const result = await requester('writeFile', file);
    if (result instanceof Error) {
    }

    reloadFileView();

    return;
  }, [selectedDirectory]);

  return {
    onClick,
  };
}
