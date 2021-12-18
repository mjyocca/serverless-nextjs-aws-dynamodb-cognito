import type { NextPage } from 'next';
import Head from 'next/head';
import useSWR from 'swr';
import Image from 'next/image';
import Dashboard from '../components/Dashboard';
import styles from '../styles/Home.module.css';
import { useSession } from 'next-auth/react';

const Home: NextPage = () => {
  const { data: session } = useSession();
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
          </>
        )}
      </div>
    </>
  );
};

export default Home;
