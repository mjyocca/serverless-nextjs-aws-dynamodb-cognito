import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import httpProxyMiddleware from 'next-http-proxy-middleware';

const secret = process.env.NEXTAUTH_SECRET as string;

export default async function proxy(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = await getToken({ req, secret });
    if (!token) {
      return res.status(401).json({ error: 'unauthenticated' });
    }
    req.headers.authorization = `Bearer ${token?.accessToken}`;
    return httpProxyMiddleware(req, res, {
      target: process.env.APIGATEWAY,
    });
  } catch (err) {
    console.error({ err });
    return res.status(500).json({ error: `Server Error` });
  }
}
