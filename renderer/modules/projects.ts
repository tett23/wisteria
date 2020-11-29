import { atom } from 'recoil';
import { Project } from 'models/Project';

export const projectViewProjects = atom<Project[]>({
  key: 'ProjectView/project',
  default: [],
});
