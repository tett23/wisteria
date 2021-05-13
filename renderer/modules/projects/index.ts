import { atom, DefaultValue, selectorFamily } from 'recoil';
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

export type FileState = 'saved' | 'renaming' | 'creating';

export const projectDirectoryStates = atom<Record<string, FileState>>({
  key: 'ProjectView/directoryStates',
  default: {},
});
