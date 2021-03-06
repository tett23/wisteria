import { AppProps } from 'next/dist/next-server/lib/router/router';
import React, { useEffect } from 'react';
import 'assets/tailwind.css';
import { RecoilRoot } from 'recoil';
import { useConfig } from '../hooks/useConfig';
import { useRestoreFromConfig } from 'hooks/useRestoreFromConfig';
import { useMessageRequester } from 'hooks/useMessageRequester';

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
  }, []);

  return null;
}

function useOnUnload(): () => Promise<void> {
  const fetchConfig = useConfig();
  const requester = useMessageRequester();

  return async () => {
    requester('saveConfig', await fetchConfig());
  };
}
