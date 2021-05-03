import { useGotoRecoilSnapshot, useRecoilCallback } from 'recoil';
import {
  editorCurrentBuffer,
  editorCurrentBufferChanged,
} from 'modules/editor';
import { projectViewProjects } from 'modules/projects';
import { useMessageRequester } from './useMessageRequester';

export function useRestoreFromConfig(): () => Promise<void> {
  const gotoSnapshot = useGotoRecoilSnapshot();
  const requester = useMessageRequester();

  return useRecoilCallback(({ snapshot }) => async () => {
    const conf = await requester('readConfig', {});
    const projectConf = await requester('readProjectConfig', {});

    const next = snapshot.map(({ set }) => {
      set(editorCurrentBuffer, conf.buffers.current.buffer);
      set(editorCurrentBufferChanged, conf.buffers.current.changed);
      set(projectViewProjects, projectConf.projects);
    });
    gotoSnapshot(next);
  });
}
