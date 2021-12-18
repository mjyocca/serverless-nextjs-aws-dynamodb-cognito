import { useMemo } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session } = useSession();
  console.log({ accessToken: session?.accessToken });
  const requestConfig = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json',
      },
    }),
    [session?.accessToken]
  );
  const { data } = useSWR<any>([`/api/user`, requestConfig]);

  console.log({ data });

  return <>{JSON.stringify(data)}</>;
}
