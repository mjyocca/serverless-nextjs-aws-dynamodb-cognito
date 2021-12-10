import type { PostConfirmationTriggerEvent, Context } from 'aws-lambda';
import dynamodb from '@libs/dynamodb';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import type { PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import type { UserEntity } from '@libs/user';
import { User } from '@libs/user';
const { log } = console;

export const main = async (event: PostConfirmationTriggerEvent, context: Context) => {
  const {
    request: { userAttributes },
  } = event;
  log({ userAttributes, event, context });
  if (!userAttributes.sub) return event;
  const params: PutItemCommandInput = {
    TableName: process.env.TABLE_NAME as string,
    Item: User({
      userId: userAttributes.email,
      email: userAttributes.email,
      sub: userAttributes.sub,
    } as UserEntity),
  };
  await dynamodb.send(new PutItemCommand(params));
  return event;
};
