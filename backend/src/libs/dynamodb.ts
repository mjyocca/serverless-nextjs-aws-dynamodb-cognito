import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const dynamodb = new DynamoDBClient({ region: process.env.REGION });

export default dynamodb;
