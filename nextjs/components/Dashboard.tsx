import { useMemo } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

export default function Dashboard() {
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
  const { data } = useSWR<any>(
    () => (requestConfig ? [`/api/user?id=${encodeURIComponent(session?.user?.email || '')}`, requestConfig] : null),
    fetcher
  );
  console.log({ requestConfig });
  console.log({ data });

  return <>{JSON.stringify(data)}</>;
}
