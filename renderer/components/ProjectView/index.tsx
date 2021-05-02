import React from 'react';
import { useRecoilValue } from 'recoil';
import { projectViewProjects } from 'modules/projects';
import { Project } from 'models/Project';
import { ProjectItemWC } from './ProjectItem';
import { AddProjectButton } from './AddProjectButton';
import { basename } from 'path';

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
    <div className="w-60 h-screen resize-x h-scroll m-2">
      <div>
        <ProjectDivider></ProjectDivider>
        {items}
      </div>
      <div>
        <AddProjectButton></AddProjectButton>
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
