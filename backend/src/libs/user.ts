import { AttributeValue } from '@aws-sdk/client-dynamodb';

export type UserDynamo = {
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
  phone: string;
  sub: string;
  githubHandle: string;
  settings: {
    theme: 'light' | 'dark';
  };
};

export function User(props: UserEntity) {
  const item: Partial<UserDynamo> = {
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
