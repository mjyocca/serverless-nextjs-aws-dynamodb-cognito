import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const { log } = console;

export const main = async (event, context) => {
  log(event);
  context.done(null, event);
};
