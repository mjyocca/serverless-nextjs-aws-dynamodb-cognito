import '../styles/globals.css'
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'next-auth/client';
import { GeistProvider, CssBaseline, Page } from '@geist-ui/react';
import { SWRConfig } from 'swr';
import fetcher from '../lib/fetcher';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider session={pageProps.session}>
        <Head><title>React Blog with NextJS & DynamoDB</title></Head>
        <SWRConfig value={{ fetcher }}>
          <GeistProvider>
            <CssBaseline />
            <Page>
              <Component {...pageProps} />
            </Page>
          </GeistProvider>
        </SWRConfig>
      </Provider>
    </>
  )
}