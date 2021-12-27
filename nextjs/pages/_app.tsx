import React, { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { GeistProvider, CssBaseline, Page, useTheme } from '@geist-ui/react';
import { SWRConfig } from 'swr';
import Header from '../components/Header';
import fetcher from '../lib/fetcher';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  const theme = useTheme();
  const [themeType, setThemeType] = useState('light');
  const switchThemes = () => {
    setThemeType((last) => (last === 'dark' ? 'light' : 'dark'));
  };
  return (
    <>
      <GeistProvider themeType={themeType}>
        <CssBaseline />
        <SessionProvider session={pageProps.session}>
          <SWRConfig value={{ fetcher }}>
            <Header switchThemes={switchThemes} />
            <Page>
              <Page.Content>
                <div className="content_wrapper">
                  <Component {...pageProps} />
                </div>
              </Page.Content>
            </Page>
          </SWRConfig>
        </SessionProvider>
      </GeistProvider>
      <style global jsx>{`
        .content_wrapper {
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
          margin: 0 auto;
          padding: 0 ${theme.layout.pageMargin};
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
}
