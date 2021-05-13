import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Foldable } from 'components/utilities/Foldable';
import { useSelectDirectory } from 'modules/fileView/useSelectDirectory';
import { useFetchDirectory } from 'modules/projects/useDirectory';
import { basename } from 'path';
import { useCallback } from 'react';
import { Directory } from '../Directory';
import { DirectoryMenu } from './DirectoryMenu';

export function Saved({ path }: { path: string }) {
  const selectDirectory = useSelectDirectory();
  const onClick = useCallback(() => {
    selectDirectory(path);
  }, []);
  const FoldWrapper = useCallback(() => <Fold path={path} />, [path]);
  const UnfoldWrapper = useCallback(() => <Unfold path={path} />, [path]);
  const FoldContentWrapper = useCallback(() => <FoldContent path={path} />, [
    path,
  ]);

  return (
    <div className="pl-2">
      <Foldable
        fold={FoldWrapper}
        unfold={UnfoldWrapper}
        foldContent={FoldContentWrapper}
        onClick={onClick}
      ></Foldable>
    </div>
  );
}

type FoldProps = {
  path: string;
};

function Fold({ path }: FoldProps) {
  return (
    <div className="flex justify-between select-none">
      <div className="flex items-center truncate">
        <FontAwesomeIcon icon={faFolder} className="fa-fw"></FontAwesomeIcon>
        <span className="ml-1 truncate">{basename(path)}</span>
      </div>
      <DirectoryMenu path={path}></DirectoryMenu>
    </div>
  );
}

type UnfoldProps = {
  path: string;
};

function Unfold({ path }: UnfoldProps) {
  return (
    <div className="flex justify-between select-none">
      <div className="flex items-center truncate">
        <FontAwesomeIcon
          icon={faFolderOpen}
          className="fa-fw"
        ></FontAwesomeIcon>
        <span className="ml-1 truncate">{basename(path)}</span>
      </div>
      <DirectoryMenu path={path}></DirectoryMenu>
    </div>
  );
}

type FoldContentProps = {
  path: string;
};

function FoldContent({ path }: FoldContentProps) {
  const dir = useFetchDirectory(path);

  const items = dir.entries
    .map((item) => {
      switch (item.type) {
        case 'file':
          return null;
        case 'directory':
          return <Directory key={item.path} path={item.path}></Directory>;
      }
    })
    .filter(Boolean);

  return <>{items}</>;
}
