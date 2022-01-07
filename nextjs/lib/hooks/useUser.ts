import { useCallback } from 'react';
import useSWR from 'swr';
import { fetchWithToken } from '../fetcher';
import { useAuth } from './useAuth';
import { authMiddleware } from '../middleware/auth';

export default function useUser<T>() {
  const { isAuthenticated, token, userId } = useAuth();

  const { data, error, mutate } = useSWR<T>(
    () => (isAuthenticated ? [`/api/user?id=${userId}`, token] : null),
    fetchWithToken,
    { use: [authMiddleware] }
  );

  const updateUser = useCallback(
    async (fields: Record<string, any>) => {
      const req = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(fields),
      });
      const res = await req.json();
      const response = {
        statusCode: req.status,
        result: res,
      };
      return response;
    },
    [token]
  );

  console.log('useUser');
  console.log({ data });

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    userId,
    updateUser,
    mutate,
  };
}
