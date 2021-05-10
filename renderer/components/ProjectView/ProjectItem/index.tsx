import React, { useCallback } from 'react';
import { Project } from 'models/Project';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { useRecoilValue } from 'recoil';
import { projectIsOpenedSelector } from 'modules/projects';
import { basename } from 'path';
import { Foldable } from 'components/utilities/Foldable';
import { Body } from './Body';
import { useSelectDirectory } from 'modules/fileView/useSelectDirectory';

type OwnProps = {
  project: Project;
};

type StateProps = {
  opened: boolean;
};

export type ProjectItemProps = StateProps & OwnProps;

export function ProjectItem(props: ProjectItemProps) {
  return (
    <div className="h12 select-none">
      <ProjectName {...props}></ProjectName>
    </div>
  );
}

export function ProjectItemWC(props: OwnProps) {
  return <ProjectItem {...useProjectItemProps(props)}></ProjectItem>;
}

export function useProjectItemProps(props: OwnProps): ProjectItemProps {
  const opened = useRecoilValue(projectIsOpenedSelector(props.project.path));

  return {
    ...props,
    opened,
  };
}

type ProjectNameProps = {
  project: Project;
  opened: boolean;
};

function ProjectName({ opened, project }: ProjectNameProps) {
  return (
    <Foldable
      isOpen={opened}
      fold={() => <Fold project={project}></Fold>}
      unfold={() => <Unfold project={project}></Unfold>}
      foldContent={() => <FoldContent project={project}></FoldContent>}
    ></Foldable>
  );
}

type FoldProps = {
  project: Project;
};

function Fold({ project: { path } }: FoldProps) {
  return (
    <>
      <FontAwesomeIcon icon={faChevronRight} className="fa-fw" />
      <span>{basename(path)}</span>
    </>
  );
}

type UnfoldProps = {
  project: Project;
};

function Unfold({ project: { path } }: UnfoldProps) {
  return (
    <>
      <FontAwesomeIcon icon={faChevronDown} className="fa-fw" />
      <span>{basename(path)}</span>
    </>
  );
}

type FoldContentProps = {
  project: Project;
};

function FoldContent({ project }: FoldContentProps) {
  const selectDirectory = useSelectDirectory();
  const onClickBody = useCallback(() => {
    selectDirectory(project.path);
  }, []);

  return (
    <div className="pl-6 select-none">
      <Body project={project}></Body>
      <ProjectElement type="body" onClick={onClickBody} />
      <ProjectElement type="wiki" onClick={() => {}} />
      <ProjectElement type="plot" onClick={() => {}} />
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
