import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Foldable } from 'components/utilities/Foldable';
import { CDirectory } from 'models/CFile';
import { Project } from 'models/Project';
import { useSelectDirectory } from 'modules/fileView/useSelectDirectory';
import { basename } from 'path';
import { useCallback, useEffect, useState } from 'react';
import { DirectoryMenu } from './DirectoryMenu';

type BodyProps = {
  project: Project;
};

export function Body({ project: { path } }: BodyProps) {
  return (
    <div>
      <Directory path={path}></Directory>
    </div>
  );
}

type FoldProps = {
  path: string;
};

function Fold({ path }: FoldProps) {
  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <FontAwesomeIcon icon={faFolder} className="fa-fw"></FontAwesomeIcon>
        <span className="ml-1">{basename(path)}</span>
      </div>
      <DirectoryMenu></DirectoryMenu>
    </div>
  );
}

type UnfoldProps = {
  path: string;
};

function Unfold({ path }: UnfoldProps) {
  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faFolderOpen}
          className="fa-fw"
        ></FontAwesomeIcon>
        <span className="ml-1">{basename(path)}</span>
      </div>
      <DirectoryMenu></DirectoryMenu>
    </div>
  );
}

type FoldContentProps = {
  path: string;
};

function FoldContent({ path }: FoldContentProps) {
  const [dir, setDir] = useState<CDirectory | null>(null);
  useEffect(() => {
    (async () => {
      const item = await global.api.message('listDirectory', path);
      if (item == null) {
        return;
      }

      setDir(item);
    })();
  }, []);

  if (dir == null) {
    return null;
  }

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

function Directory({ path }: { path: string }) {
  const selectDirectory = useSelectDirectory();
  const onClick = useCallback(() => {
    selectDirectory(path);
  }, []);

  return (
    <div className="pl-2">
      <Foldable
        fold={() => <Fold path={path}></Fold>}
        unfold={() => <Unfold path={path}></Unfold>}
        foldContent={() => <FoldContent path={path}></FoldContent>}
        onClick={onClick}
      ></Foldable>
    </div>
  );
}
