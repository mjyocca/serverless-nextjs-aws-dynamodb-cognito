import { default as user } from './user';
import { default as cognitoPostConfirm } from './cognitoPostConfirm';
import { default as userPoolClientSecret } from './cloudFormation';

export const handlers = [
  {
    path: '/api/user',
    handler: require('./user/handler').handler,
  },
];

export default {
  user,
  cognitoPostConfirm,
  userPoolClientSecret,
};
