import { SSMClient, GetParametersCommand } from '@aws-sdk/client-ssm';
import type { GetParametersCommandInput } from '@aws-sdk/client-ssm';

const client = new SSMClient({ region: process.env.REGION });

const { log } = console;

export default async function getEnvVariables(names: string[]) {
  const params: GetParametersCommandInput = {
    Names: names,
  };
  const response = await client.send(new GetParametersCommand(params));
  log({ response, params: response?.Parameters });
  return response?.Parameters;
}
