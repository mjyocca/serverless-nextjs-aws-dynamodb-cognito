// import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PostConfirmationTriggerEvent, Context } from 'aws-lambda';

const { log } = console;

export const main = async (event: PostConfirmationTriggerEvent, context: Context) => {
  log({ event });
  log({ context });
  return event;
};
