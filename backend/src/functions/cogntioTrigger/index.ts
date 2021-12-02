import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      cognitoUserPool: {
        pool: { Ref: 'serviceUserPool' },
        trigger: 'PostConfirmation',
        existing: true,
      },
    },
  ],
};
