import { useSession } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';

  const userId = encodeURIComponent(session?.user?.email || '');

  return {
    session,
    userId,
    isAuthenticated,
  };
};
