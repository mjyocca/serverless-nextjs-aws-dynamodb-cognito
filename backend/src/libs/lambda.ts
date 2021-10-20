import 'source-map-support/register';
import serverless from 'serverless-http';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { app } from '@libs/app';
import type { Request, Response } from '@tinyhttp/app';

interface LambdaRequest extends Request {
  serverless: {
    event: APIGatewayProxyEvent;
    context: Context;
  };
}

type LambdaResponse<T = any> = Response<T>;

type handlerCallback = (
  req: LambdaRequest,
  res: LambdaResponse
) => any | ((req: LambdaRequest, res: LambdaResponse) => Promise<any>);

export type { LambdaRequest, LambdaResponse };

let handler;

export const createHandler = (func: handlerCallback) => {
  app.use('/', func);
  return async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    if (!handler) {
      handler = serverless(app.handler.bind(app), {
        request: (request) => {
          request.serverless = { event, context };
        },
      });
    }
    const result = await handler(event, context);
    return result;
  };
};

export default {
  createHandler,
};
