import React from 'react';
import { useRecoilValue } from 'recoil';
import { projectViewProjects } from 'modules/projects';
import { Project } from 'models/Project';
import { ProjectItemWC } from './ProjectItem';

export type ProjectViewProps = {
  projects: Project[];
};

export function ProjectView({ projects }: ProjectViewProps) {
  const items = projects.map((item) => (
    <div key={item.name} className="py-4">
      <ProjectItemWC project={item}></ProjectItemWC>
    </div>
  ));

  return (
    <div className="w-60 resize-x h-scroll m-2">
      <ProjectDivider></ProjectDivider>
      {items}
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
