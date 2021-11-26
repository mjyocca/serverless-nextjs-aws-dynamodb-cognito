import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css';
import { signIn, signOut, useSession } from 'next-auth/client'

const Home: NextPage = () => {
  const [session, loading] = useSession();

  return (
    <>
      <Head><title>{!session && <>Welcome and Sign in</>}</title></Head>
      <div>
        {session &&
          <>
            <div>Signed In</div>
            <>{JSON.stringify(session)}</>
            <><button onClick={() => signOut()}>Sign Out</button></>
          </>
        }
        {!session &&
          <>
            <div>Signed Out</div>
            <button onClick={() => {
              signIn('cognito', {
                callbackUrl: `${window.location.origin}`
              })
            }}>Sign In</button>
          </>
        }
      </div>
    </>
  )
}

export default Home
