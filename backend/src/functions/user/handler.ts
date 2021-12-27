import lambda from '@libs/lambda';
import type { LambdaRequest, LambdaResponse } from '@libs/lambda';
import { getUserById, updateUser } from '@libs/dynamodb/user';
import type { UserEntityUpdate } from '@libs/dynamodb/user';

async function GetHandler({ query }, res) {
  const { id } = query;
  const user = await getUserById(id);
  if (user) {
    return res.status(200).json(user);
  }
  return res.status(400).json({ error: 'user not found' });
}

async function PatchHandler(req, res) {
  const { body } = req;
  const updatedUserInfo: UserEntityUpdate = JSON.parse(body);
  await updateUser(updatedUserInfo);
  return res.status(200);
}

export async function handler(req: LambdaRequest, res: LambdaResponse) {
  try {
    const { method } = req;
    switch (method) {
      case 'GET':
        return GetHandler(req, res);
      case 'PATCH':
        return PatchHandler(req, res);
      case 'OPTIONS':
        return res.status(200);
      default:
        return res.status(404).send('resource not found');
    }
  } catch (err) {
    console.error(`ERROR: `, { err });
    return res.status(500).json({ error: 'server error' });
  }
}

export const main = lambda.createHandler(handler);
