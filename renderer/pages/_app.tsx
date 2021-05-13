import { AppProps } from 'next/dist/next-server/lib/router/router';
import React, { useEffect } from 'react';
import 'assets/tailwind.css';
import { RecoilRoot, useGotoRecoilSnapshot, useRecoilCallback } from 'recoil';
import { editorBody } from 'modules/editor';

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
  const u = useStart();
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

function useStart(): () => Promise<void> {
  const gotoSnapshot = useGotoRecoilSnapshot();
  return useRecoilCallback(({ snapshot }) => async () => {
    const conf = await global.api.message('readConfig', {});

    const next = snapshot.map(({ set }) => {
      set(editorBody, conf.buffer.content);
    });
    gotoSnapshot(next);
  });
}

function useFetchConfig(): () => Promise<WisteriaConfig> {
  return useRecoilCallback(
    ({ snapshot }) => async (): Promise<WisteriaConfig> => {
      const buf = await snapshot.getPromise(editorBody);

      return {
        window: {
          x: window.screenX,
          y: window.screenY,
          width: window.innerWidth,
          height: window.innerHeight,
        },
        buffer: {
          content: buf,
        },
      };
    },
  );
}
