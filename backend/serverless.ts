import type { AWS } from '@serverless/typescript';
import functions from '@functions/index';
import { execSync } from 'child_process';

const [{ dependencies }]: [{ dependencies: Record<string, any> }] = JSON.parse(execSync('pnpm ls --prod --json').toString());

const externals = Object.entries(dependencies)
	.reduce((acc: string[], [name, dep]) => {
		if (!dep.version.startsWith('link:')) acc.push(name)
		return acc;
	}, []);

const serverlessConfiguration: AWS = {
  service: 'serverless-typescript-template',
  frameworkVersion: '2',
  custom: {
    esbuild: {
      packager: 'npm',
      bundle: true,
      minify: false,
      sourcemap: true,
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      external: externals
    },
  },
  useDotenv: true,
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      DOMAIN_SUFFIX: '${env.DOMAIN_SUFFIX}',
    },
    region: 'us-east-1',
    lambdaHashingVersion: '20201221',
    httpApi: {
      authorizers: {
        serviceAuthorizer: {
          name: 'serviceAuthorizer',
          type: 'jwt',
          identitySource: '$request.header.Authorization',
          issuerUrl: {
            'Fn::Join': [
              '',
              [
                'https://cognito-idp.',
                '${opt:region, self:provider.region}',
                '.amazonaws.com/',
                { Ref: 'serviceUserPool' },
              ],
            ],
          },
          audience: {
            Ref: 'serviceUserPoolClient',
          },
        },
      },
    },
  },
  functions,
  resources: {
    Resources: {
      HttpApi: {
        Type: 'AWS::ApiGatewayV2::Api',
        DependsOn: ['serviceUserPool'],
      },
      serviceUserPool: {
        Type: 'AWS::Cognito::UserPool',
        Properties: {
          UserPoolName: 'service-user-pool-${opt:stage, self:provider.stage}',
          UsernameAttributes: ['email'],
          AutoVerifiedAttributes: ['email'],
        },
      },
      serviceUserPoolClient: {
        Type: 'AWS::Cognito::UserPoolClient',
        Properties: {
          ClientName: 'service-user-pool-client-${opt:stage, self:provider.stage}',
          AllowedOAuthFlows: ['implicit'],
          AllowedOAuthFlowsUserPoolClient: true,
          AllowedOAuthScopes: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
          UserPoolId: {
            Ref: 'serviceUserPool',
          },
          CallbackURLs: ['http://localhost:3000', 'http://localhost:5000'],
          ExplicitAuthFlows: ['ALLOW_USER_SRP_AUTH', 'ALLOW_REFRESH_TOKEN_AUTH'],
          GenerateSecret: false,
          SupportedIdentityProviders: ['COGNITO'],
        },
      },
      serviceUserPoolDomain: {
        Type: 'AWS::Cognito::UserPoolDomain',
        Properties: {
          UserPoolId: {
            Ref: 'serviceUserPool',
          },
          Domain: 'service-user-pool-domain-${opt:stage, self:provider.stage}-${env:DOMAIN_SUFFIX}',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
