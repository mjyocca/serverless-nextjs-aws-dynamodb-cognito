import '../styles/globals.css';
import { useState } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { GeistProvider, CssBaseline, Page, useTheme } from '@geist-ui/react';
import { SWRConfig } from 'swr';
import Header from '../components/Header';
import fetcher from '../lib/fetcher';

export default function App({ Component, pageProps }: AppProps) {
  const theme = useTheme();
  const [themeType, setThemeType] = useState('light');
  const switchThemes = () => {
    setThemeType((last) => (last === 'dark' ? 'light' : 'dark'));
  };
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <Head>
          <title>Serverless NextJS Dashboard</title>
        </Head>
        <SWRConfig value={{ fetcher }}>
          <GeistProvider themeType={themeType}>
            <CssBaseline />
            <Header switchThemes={switchThemes} />
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
      </SessionProvider>
    </>
  );
}
