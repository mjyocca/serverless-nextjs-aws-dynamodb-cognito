import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: '*',
        path: '/api/hello',
        authorizer: 'serviceAuthorizer',
      },
    },
  ],
};
