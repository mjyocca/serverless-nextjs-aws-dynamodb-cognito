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
  firstName: AttributeValue;
  lastName: AttributeValue;
  cognitoSub: AttributeValue;
  email: AttributeValue;
  phone: AttributeValue;
  githubHandle: AttributeValue;
  settings: AttributeValue;
};

export type UserEntity = {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  sub: string;
  githubHandle?: string;
  settings?: {
    theme: 'light' | 'dark';
  };
};

export type UserEntityUpdate = Pick<
  UserEntity,
  'userId' | 'githubHandle' | 'phone' | 'settings' | 'firstName' | 'lastName'
>;

export async function createUser(data: UserEntity) {
  const params: PutItemCommandInput = {
    TableName: userTable,
    Item: mapDynamoUser(data),
  };
  return dynamodb.send(new PutItemCommand(params));
}

export async function updateUser(data: UserEntityUpdate) {
  console.log('updateUser');
  const params: UpdateItemCommandInput = {
    TableName: userTable,
    Key: {
      PK: { S: `USER#${data.userId}` },
    },
    UpdateExpression: `set phone = :p, githubHandle = :g, settings = :s, firstName = :f, lastName = :l`,
    ExpressionAttributeValues: {
      ':p': { S: data.phone },
      ':g': { S: data.githubHandle },
      ':s': { S: JSON.stringify(data.settings) },
      ':f': { S: data.firstName },
      ':l': { S: data.lastName },
    },
    ReturnValues: 'ALL_NEW',
  };
  console.log({ params });
  return dynamodb.send(new UpdateItemCommand(params));
}

export async function getUserById(id: string) {
  const params: GetItemCommandInput = {
    TableName: userTable,
    Key: {
      PK: { S: `USER#${id}` },
    },
    ProjectionExpression: `PK, SK, cognitoSub, email, firstName, lastName, phone, githubHandle, settings`,
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
  if (props.firstName) user.firstName = props.firstName.S;
  if (props.lastName) user.lastName = props.lastName.S;
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
  if (props.firstName) item.firstName = { S: props.firstName };
  if (props.lastName) item.lastName = { S: props.lastName };
  return item;
}
