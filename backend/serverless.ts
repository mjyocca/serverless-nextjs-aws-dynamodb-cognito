import type { AWS } from "@serverless/typescript";
import * as fns from "@functions/index";

const functions = { ...fns };

const serverlessConfiguration: AWS = {
	service: "serverless-typescript-template",
	frameworkVersion: "2",
	custom: {
		esbuild: {
			packager: "pnpm",
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ["aws-sdk"],
			target: "node14",
			define: { "require.resolve": undefined },
			platform: "node",
		},
	},
	plugins: ["serverless-esbuild"],
	provider: {
		name: "aws",
		runtime: "nodejs14.x",
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
			NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
		},
		lambdaHashingVersion: "20201221",
	},
	functions,
};

module.exports = serverlessConfiguration;
