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
    {
      httpApi: {
        method: 'POST',
        path: '/api/user',
        authorizer: 'serviceAuthorizer',
      },
    },
    {
      httpApi: {
        method: 'PATCH',
        path: '/api/user',
        authorizer: 'serviceAuthorizer',
      },
    },
  ],
  environment: {
    TABLE_NAME: { Ref: 'UserTable' },
    REGION: '${opt:region, self:provider.region}',
  },
};
