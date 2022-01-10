import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import type { CloudFormationCustomResourceEvent, Context } from 'aws-lambda';
import type { DescribeUserPoolClientCommandInput } from '@aws-sdk/client-cognito-identity-provider';
import { send, SUCCESS, FAILED } from 'cfn-response-async';

const providerClient = new CognitoIdentityProvider({ region: process.env.REGION });

export const main = async (event: CloudFormationCustomResourceEvent, context: Context) => {
  try {
    const { RequestType } = event;
    if (RequestType === 'Delete') {
      await send(event, context, SUCCESS);
    }
    if (['Create', 'Update'].includes(RequestType)) {
      const params: DescribeUserPoolClientCommandInput = {
        UserPoolId: event.ResourceProperties.userpoolId,
        ClientId: event.ResourceProperties.clientId,
      };
      const res = await providerClient.describeUserPoolClient(params);
      await send(event, context, SUCCESS, { clientSecret: res.UserPoolClient.ClientSecret });
      return;
    }
  } catch (err) {
    await send(event, context, FAILED, { err });
    return;
  }
};
