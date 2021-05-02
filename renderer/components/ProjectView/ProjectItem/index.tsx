import React, { useCallback } from 'react';
import { Project } from 'models/Project';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { projectIsOpenedSelector } from 'modules/projects';
import { basename } from 'path';
import { fileViewFiles } from 'modules/fileView';

type OwnProps = {
  project: Project;
};

type StateProps = {
  opened: boolean;
  setOpened: (value: boolean) => void;
};

export type ProjectItemProps = StateProps & OwnProps;

export function ProjectItem(props: ProjectItemProps) {
  return (
    <div className="h12">
      <ProjectName {...props}></ProjectName>
    </div>
  );
}

export function ProjectItemWC(props: OwnProps) {
  return <ProjectItem {...useProjectItemProps(props)}></ProjectItem>;
}

export function useProjectItemProps(props: OwnProps): ProjectItemProps {
  const [opened, setOpened] = useRecoilState(
    projectIsOpenedSelector(props.project.path),
  );

  return {
    ...props,
    opened,
    setOpened,
  };
}

type ProjectNameProps = {
  project: Project;
  opened: boolean;
  setOpened: (value: boolean) => void;
};

function ProjectName({ opened, project, setOpened }: ProjectNameProps) {
  switch (opened) {
    case true:
      return <Unfold project={project} setOpened={setOpened} />;
    case false:
      return <Fold project={project} setOpened={setOpened} />;
  }
}

type FoldProps = {
  project: Project;
  setOpened: (value: boolean) => void;
};

function Fold({ project: { path }, setOpened }: FoldProps) {
  return (
    <div className="cursor-pointer">
      <FontAwesomeIcon icon={faChevronRight} className="fa-fw" />
      <span onClick={() => setOpened(true)}>{basename(path)}</span>
    </div>
  );
}

type UnfoldProps = {
  project: Project;
  setOpened: (value: boolean) => void;
};

function Unfold({ project: { path }, setOpened }: UnfoldProps) {
  const setFileViewFiles = useSetRecoilState(fileViewFiles);

  const onClickBody = useCallback(async () => {
    const result = await global.api.message('listDirectoryFiles', path);
    setFileViewFiles(result);
  }, []);
  return (
    <div>
      <div onClick={() => setOpened(false)} className="cursor-pointer">
        <FontAwesomeIcon icon={faChevronDown} className="fa-fw" />
        {basename(path)}
      </div>
      <div className="pl-6">
        <ProjectElement type="body" onClick={onClickBody} />
        <ProjectElement type="wiki" onClick={() => {}} />
        <ProjectElement type="plot" onClick={() => {}} />
      </div>
    </div>
  );
}

type ProjectElementProps = {
  type: 'body' | 'wiki' | 'plot';
  onClick: () => void;
};

function ProjectElement({ type, onClick }: ProjectElementProps) {
  return <div onClick={onClick}>{type}</div>;
}
