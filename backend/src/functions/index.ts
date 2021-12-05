import { default as hello } from './hello';
import { default as world } from './world';
import { default as cognitoPostConfirm } from './cognitoPostConfirm';

export const handlers = [
  {
    path: '/api/hello',
    handler: require('./hello/handler').handler,
  },
  {
    path: '/api/world',
    handler: require('./world/handler').handler,
  },
];

export default {
  hello,
  world,
  cognitoPostConfirm,
};
