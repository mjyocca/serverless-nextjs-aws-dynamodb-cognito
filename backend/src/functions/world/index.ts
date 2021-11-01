import { handlerPath } from '@libs/handlerResolver';

const ServerlessConfig = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: '*',
        path: '/api/world',
        authorizer: 'serviceAuthorizer',
      },
    },
  ],
};

export default ServerlessConfig;
