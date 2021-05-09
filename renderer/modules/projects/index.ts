import { atom, DefaultValue, selectorFamily, useRecoilCallback } from 'recoil';
import { Project } from 'models/Project';
import { CDirectory } from 'models/CFile';

export const projectViewProjects = atom<Project[]>({
  key: 'ProjectView/project',
  default: [],
});

export const projectIsOpendStates = atom<Record<string, boolean>>({
  key: 'ProjectView/isOpendStates',
  default: {},
});

export const projectDirectories = atom<Record<string, CDirectory>>({
  key: 'ProjectView/directories',
  default: {},
});

export const projectIsOpenedSelector = selectorFamily({
  key: 'ProjectView/isOpenedStates/isOpened',
  set: (id: string) => ({ get, set }, newValue: boolean | DefaultValue) => {
    set(projectIsOpendStates, {
      ...get(projectIsOpendStates),
      [id]: newValue instanceof DefaultValue ? true : newValue,
    });
  },
  get: (id: string) => ({ get }) => get(projectIsOpendStates)[id] ?? false,
});

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
