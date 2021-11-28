import '../styles/globals.css'
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'next-auth/client';
import { GeistProvider, CssBaseline, Page, useTheme } from '@geist-ui/react';
import { SWRConfig } from 'swr';
import Header from '../components/Header'
import fetcher from '../lib/fetcher';

export default function App({ Component, pageProps }: AppProps) {
  const theme = useTheme();
  return (
    <>
      <Provider session={pageProps.session}>
        <Head>
          <title>React Blog with NextJS & DynamoDB</title>
        </Head>
        <SWRConfig value={{ fetcher }}>
          <GeistProvider>
            <CssBaseline />
            <Header />
            <Page>
              <Page.Content>
                <div className="content_wrapper">
                  <Component {...pageProps} />
                </div>
              </Page.Content>
            </Page>
          </GeistProvider>
        </SWRConfig>
        <style jsx>{`
          .content_wrapper {
            width: ${theme.layout.pageWidthWithMargin};
            max-width: 100%;
            margin: 0 auto;
            padding: 0 ${theme.layout.pageMargin};
            box-sizing: border-box;
          }
        `}</style>
      </Provider>
    </>
  )
}