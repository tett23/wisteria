import React from 'react';
import { useRecoilValue } from 'recoil';
import { projectViewProjects } from 'modules/projects';
import { Project } from 'models/Project';
import { ProjectItemWC } from './ProjectItem';
import { AddProjectButton } from './AddProjectButton';
import { basename } from 'path';
import { ScrollY } from 'components/utilities/ScrollY';

export type ProjectViewProps = {
  projects: Project[];
};

export function ProjectView({ projects }: ProjectViewProps) {
  const items = projects.map((item) => (
    <div key={basename(item.path)} className="py-4">
      <ProjectItemWC project={item}></ProjectItemWC>
    </div>
  ));

  return (
    <div className="h-screen resize-x h-scroll bg-coolGray-200">
      <ScrollY className="h-screen">
        <div className="m-2">
          <ProjectDivider></ProjectDivider>
          {items}
        </div>
      </ScrollY>
      <Container></Container>
    </div>
  );
}

function Container() {
  return (
    <div className="relative bottom-7 left-0 w-full h-7 border-t-2">
      <div className="flex justify-start">
        <div className="ml-2">
          <AddProjectButton></AddProjectButton>
        </div>
      </div>
    </div>
  );
}

export function ProjectViewContainer() {
  return <ProjectView {...useProjectViewProps()} />;
}

function useProjectViewProps(): ProjectViewProps {
  const projects = useRecoilValue(projectViewProjects);

  return {
    projects,
  };
}

export function ProjectDivider() {
  return (
    <div className="tracking-wide text-sm text-gray-700 bold">PROJECTS</div>
  );
}
