import { handlerPath } from '@libs/handlerResolver';

type cognitoEventTrigger = {
  cognitoUserPool: {
    pool: string;
    trigger:
      | 'PreSignUp'
      | 'PostConfirmation'
      | 'PreAuthentication'
      | 'PostAuthentication'
      | 'PreTokenGeneration'
      | 'CustomMessage'
      | 'DefineAuthChallenge'
      | 'CreateAuthChallenge'
      | 'VerifyAuthChallengeResponse'
      | 'UserMigration';
    existing?: boolean;
  };
};

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      cognitoUserPool: {
        pool: '${self:custom.userPoolName}',
        trigger: 'PostConfirmation',
        existing: true,
      },
    } as cognitoEventTrigger,
  ],
};
