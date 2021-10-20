import { createHandler } from '@libs/lambda';
import type { LambdaRequest, LambdaResponse } from '@libs/lambda';

export async function handler(req: LambdaRequest, res: LambdaResponse) {
  return res.json({ handler: 'world', req: req?.serverless || {} });
}

export const main = createHandler(handler);
