import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
	service: "fullstack-nextjs-serverless",
	frameworkVersion: "*",
	provider: {
		name: "aws",
		runtime: "nodejs14.x",
	},
};

module.exports = serverlessConfiguration;
