import type { NextPage } from 'next';
import Head from 'next/head';
import Dashboard from '../components/Dashboard';
import { Display, Image } from '@geist-ui/react';
import { useAuth } from '../lib/hooks/useAuth';

const Home: NextPage = () => {
  const { session } = useAuth();
  return (
    <>
      <Head>
        <title>{!session && <>Welcome and Sign in</>}</title>
      </Head>
      <div>
        {session ? (
          <Dashboard />
        ) : (
          <>
            <div>Welcome and Sign in</div>
            <Display shadow caption="An open-source design system for building modern websites and applications.">
              <Image width="435px" height="200px" src="https://react.geist-ui.dev/images/geist-banner.png" alt="test" />
            </Display>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
