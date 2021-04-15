import { AppProps } from 'next/dist/next-server/lib/router/router';
import React from 'react';
import 'assets/tailwind.css';
import { RecoilRoot } from 'recoil';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />;
    </RecoilRoot>
  );
}
