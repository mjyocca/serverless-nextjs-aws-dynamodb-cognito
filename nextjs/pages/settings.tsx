import type { NextPage } from 'next';
import { useMemo } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

const Settings: NextPage = () => {
  const { data: session } = useSession();
  console.log({ session, accessToken: session?.accessToken });
  const requestConfig = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
      },
    }),
    [session?.accessToken]
  );
  const { data: helloData } = useSWR<any>([`/api/hello`, requestConfig], fetcher);

  console.log({ helloData });

  return (
    <>
      Settings
      {JSON.stringify(helloData)}
    </>
  );
};

export default Settings;
