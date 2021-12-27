import type { PostConfirmationTriggerEvent, Context } from 'aws-lambda';
import type { UserEntity } from '@libs/dynamodb/user';
import { createUser } from '@libs/dynamodb/user';
const { log } = console;

export const main = async (event: PostConfirmationTriggerEvent, context: Context) => {
  const {
    request: { userAttributes },
  } = event;
  log({ userAttributes, event, context });
  const user = {
    userId: userAttributes.email,
    email: userAttributes.email,
    sub: userAttributes.sub,
  };
  const res = await createUser(user as UserEntity);
  log({ res });
  return event;
};
