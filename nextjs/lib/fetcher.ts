export default async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

export const fetchWithToken = async <JSON = any>(key: RequestInfo, token: string): Promise<JSON> => {
  const res = await fetch(key, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.json();
};
