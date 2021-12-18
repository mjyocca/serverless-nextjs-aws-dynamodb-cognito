export default async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const APIGATEWAY = process.env.APIGATEWAY ?? '';
  const res = await fetch(`${APIGATEWAY}${input}`, init);
  return res.json();
}
