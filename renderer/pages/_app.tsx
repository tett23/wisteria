import { AppProps } from 'next/dist/next-server/lib/router/router';
import React from 'react';
import 'assets/tailwind.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
