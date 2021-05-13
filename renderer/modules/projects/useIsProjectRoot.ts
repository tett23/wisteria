import { useRecoilValue } from 'recoil';
import { projectViewProjects } from './index';

export function useIsProjectRoot(path: string) {
  return useRecoilValue(projectViewProjects).some((item) => item.path === path);
}
