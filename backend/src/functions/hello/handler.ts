import lambda from "@libs/lambda";
import type { LambdaRequest, LambdaResponse } from "@libs/lambda";

export async function handler(_req: LambdaRequest, res: LambdaResponse) {
	const { method } = _req;
	return res.send({ handler: "hello", method });
}

export const main = lambda.createHandler(handler);
