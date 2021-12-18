import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'OPTIONS',
        path: '/{proxy+}',
      },
    },
    {
      httpApi: {
        method: 'GET',
        path: '/api/user',
        authorizer: 'serviceAuthorizer',
      },
    },
  ],
};
