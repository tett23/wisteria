import { AppProps } from 'next/dist/next-server/lib/router/router';
import React, { useEffect } from 'react';
import 'assets/tailwind.css';
import { RecoilRoot } from 'recoil';
import { useConfig } from '../hooks/useConfig';
import { useRestoreFromConfig } from 'hooks/useRestoreFromConfig';

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
  const restore = useRestoreFromConfig();
  useEffect(() => {
    restore();
    window.addEventListener('unload', onUnload);
    (async () => {
      const workerResource = await fetch('workers://sample.js');

      const sampleWorker = new Worker(
        URL.createObjectURL(await workerResource.blob()),
      );
      sampleWorker.postMessage('ping');
      sampleWorker.addEventListener('message', (mes) => {
        console.log(mes);
      });
    })();
  }, []);

  return null;
}

function useOnUnload(): () => Promise<void> {
  const fetchConfig = useConfig();

  return async () => {
    global.api.message('saveConfig', await fetchConfig());
  };
}
