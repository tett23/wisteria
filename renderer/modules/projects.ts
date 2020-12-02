import { atom, DefaultValue, selectorFamily } from 'recoil';
import { Project } from 'models/Project';

export const projectViewProjects = atom<Project[]>({
  key: 'ProjectView/project',
  default: [],
});

export const projectIsOpendStates = atom<Record<string, boolean>>({
  key: 'ProjectView/isOpendStates',
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
