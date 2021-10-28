import { handlerPath } from '@libs/handlerResolver';

const ServerlessConfig = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: '*',
        path: '/api/world',
      },
    },
  ],
};

export default ServerlessConfig;
