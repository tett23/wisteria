import { faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Foldable } from 'components/utilities/Foldable';
import { CDirectory } from 'models/CFile';
import { Project } from 'models/Project';
import { fileViewFiles } from 'modules/fileView';
import { basename } from 'path';
import { useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';

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
    <>
      <FontAwesomeIcon icon={faFolder} className="fa-fw"></FontAwesomeIcon>
      <span className="ml-1">{basename(path)}</span>
    </>
  );
}

type UnfoldProps = {
  path: string;
};

function Unfold({ path }: UnfoldProps) {
  return (
    <>
      <FontAwesomeIcon icon={faFolderOpen} className="fa-fw"></FontAwesomeIcon>
      <span className="ml-1">{basename(path)}</span>
    </>
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
  const setFileViewFiles = useSetRecoilState(fileViewFiles);
  const onClick = useCallback(async () => {
    const result = await global.api.message('listDirectoryFiles', path);
    setFileViewFiles(result);
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
