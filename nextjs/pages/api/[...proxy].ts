import type { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

export default function proxy(req: NextApiRequest, res: NextApiResponse) {
  try {
    return httpProxyMiddleware(req, res, {
      target: process.env.APIGATEWAY,
    });
  } catch (err) {
    console.log({ err });
    return res.status(201).json({ error: err });
  }
}
