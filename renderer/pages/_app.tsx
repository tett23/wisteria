import { AppProps } from 'next/dist/next-server/lib/router/router';
import React, { useEffect } from 'react';
import 'assets/tailwind.css';
import { RecoilRoot, useGotoRecoilSnapshot, useRecoilCallback } from 'recoil';
import {
  editorCurrentBuffer,
  editorCurrentBufferChanged,
} from 'modules/editor';
import { WisteriaConfig } from 'messages';
import { projectViewProjects } from 'modules/projects';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Effect></Effect>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

function Effect() {
  const onUnload = useOnUnload();
  const u = useOnMount();
  useEffect(() => {
    u();
    window.addEventListener('unload', onUnload);
  }, []);

  return null;
}

function useOnUnload(): () => Promise<void> {
  const fetchConfig = useFetchConfig();

  return async () => {
    global.api.message('saveConfig', await fetchConfig());
  };
}

function useOnMount(): () => Promise<void> {
  const gotoSnapshot = useGotoRecoilSnapshot();
  return useRecoilCallback(({ snapshot }) => async () => {
    const conf = await global.api.message('readConfig', {});
    const projectConf = await global.api.message('readProjectConfig', {});

    const next = snapshot.map(({ set }) => {
      set(editorCurrentBuffer, conf.buffers.current.buffer);
      set(editorCurrentBufferChanged, conf.buffers.current.changed);
      set(projectViewProjects, projectConf.projects);
    });
    gotoSnapshot(next);
  });
}

function useFetchConfig(): () => Promise<WisteriaConfig> {
  return useRecoilCallback(
    ({ snapshot }) => async (): Promise<WisteriaConfig> => {
      const buf = await snapshot.getPromise(editorCurrentBuffer);
      const bufChanged = await snapshot.getPromise(editorCurrentBufferChanged);

      return {
        window: {
          x: window.screenX,
          y: window.screenY,
          width: window.innerWidth,
          height: window.innerHeight,
        },
        buffers: {
          current: {
            buffer: buf,
            changed: bufChanged,
          },
        },
      };
    },
  );
}
