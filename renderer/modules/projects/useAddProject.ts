import { useRecoilCallback } from 'recoil';
import { Project } from 'models/Project';
import { projectViewProjects } from './index';

export function useAddProject(): (project: Project) => void {
  return useRecoilCallback(
    ({ set }) => (project: Project) => {
      set(projectViewProjects, (current) => {
        return [...current, project];
      });
    },
    [],
  );
}
