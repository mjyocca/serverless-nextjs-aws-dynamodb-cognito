import dynamodb from './dynamodb';
import { GetItemCommand, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import type {
  AttributeValue,
  GetItemCommandInput,
  PutItemCommandInput,
  UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';

const userTable = process.env.TABLE_NAME as string;

export type DynamoUser = {
  PK: AttributeValue;
  SK: AttributeValue;
  cognitoSub: AttributeValue;
  email: AttributeValue;
  phone: AttributeValue;
  githubHandle: AttributeValue;
  settings: AttributeValue;
};

export type UserEntity = {
  userId: string;
  email: string;
  phone?: string;
  sub: string;
  githubHandle?: string;
  settings?: {
    theme: 'light' | 'dark';
  };
};

export type UserEntityUpdate = Pick<UserEntity, 'userId' | 'githubHandle' | 'phone' | 'settings'>;

export async function createUser(data: UserEntity) {
  const params: PutItemCommandInput = {
    TableName: userTable,
    Item: mapDynamoUser(data),
  };
  return dynamodb.send(new PutItemCommand(params));
}

export async function updateUser(data: UserEntityUpdate) {
  const params: UpdateItemCommandInput = {
    TableName: userTable,
    Key: {
      PK: { S: `USER#${data.userId}` },
    },
    UpdateExpression: `set phone = :p, githubHandler = :g, settings = :s`,
    ExpressionAttributeValues: {
      ':p': { S: data.phone },
      ':g': { S: data.githubHandle },
      ':s': { S: JSON.stringify(data.settings) },
    },
    ReturnValues: 'ALL_NEW',
  };
  return dynamodb.send(new UpdateItemCommand(params));
}

export async function getUserById(id: string) {
  const params: GetItemCommandInput = {
    TableName: userTable,
    Key: {
      PK: { S: `USER#${id}` },
    },
    ProjectionExpression: `PK, SK, cognitoSub, email, phone, githubHandle, settings`,
  };
  const { Item } = await dynamodb.send(new GetItemCommand(params));
  if (!Item) return null;
  return getUserEntity(Item as DynamoUser);
}

export function getUserEntity(props: DynamoUser) {
  const user: Partial<UserEntity> = {
    userId: props.PK.S,
    email: props.email.S,
  };
  if (props.phone) user.phone = props.phone.S;
  if (props.githubHandle) user.githubHandle = props.githubHandle.S;
  if (props.settings) user.settings = JSON.parse(props.settings.S);
  return user;
}

export function mapDynamoUser(props: UserEntity) {
  const item: Partial<DynamoUser> = {
    PK: { S: `USER#${props.userId}` },
    SK: { S: `#PROFILE#${props.userId}` },
    email: { S: props.email },
    cognitoSub: { S: props.sub },
  };
  if (props.phone) item.phone = { S: props.phone };
  if (props.githubHandle) item.githubHandle = { S: props.githubHandle };
  if (props.settings) item.settings = { S: JSON.stringify(props.settings) };
  return item;
}
