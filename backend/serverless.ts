import type { AWS } from '@serverless/typescript';
import functions from '@functions/index';
import { execSync } from 'child_process';

type AWSResources = AWS['resources'];
type AWSOutputs = AWSResources['Outputs'];

const [{ dependencies }]: [{ dependencies: Record<string, any> }] = JSON.parse(
  execSync('pnpm ls --prod --json').toString()
);

const externals = Object.entries(dependencies).reduce((acc: string[], [name, dep]) => {
  if (!dep.version.startsWith('link:')) acc.push(name);
  return acc;
}, []);

const serviceUserPool = {
  Type: 'AWS::Cognito::UserPool',
  Properties: {
    UserPoolName: '${self:custom.userPoolName}',
    UsernameAttributes: ['email'],
    AutoVerifiedAttributes: ['email'],
  },
};

const serviceUserPoolClient = {
  Type: 'AWS::Cognito::UserPoolClient',
  Properties: {
    ClientName: 'service-user-pool-client-${self:custom.stage}',
    AllowedOAuthFlows: ['code'],
    AllowedOAuthFlowsUserPoolClient: true,
    AllowedOAuthScopes: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
    UserPoolId: {
      Ref: 'serviceUserPool',
    },
    CallbackURLs: ['http://localhost:3000/api/auth/callback/cognito'],
    ExplicitAuthFlows: ['ALLOW_USER_SRP_AUTH', 'ALLOW_REFRESH_TOKEN_AUTH'],
    GenerateSecret: true,
    SupportedIdentityProviders: ['COGNITO'],
  },
};

if (process.env.APP_URL) {
  serviceUserPoolClient.Properties.CallbackURLs.push('${env:APP_URL}/api/auth/callback/cognito');
}

const serviceUserPoolDomain = {
  Type: 'AWS::Cognito::UserPoolDomain',
  Properties: {
    UserPoolId: {
      Ref: 'serviceUserPool',
    },
    Domain: 'service-user-pool-domain-${self:custom.stage}-${env:DOMAIN_SUFFIX}',
  },
};

const UserTable = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: 'Users',
    KeySchema: [
      {
        AttributeName: 'PK',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'PK',
        AttributeType: 'S',
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
};

const Outputs: AWSOutputs = {
  UserPoolIdOutput: {
    Value: { Ref: 'serviceUserPool' },
    Export: {
      Name: '${self:custom.stage}-UserPoolId',
    },
  },
  UserPoolClientIdOutput: {
    Value: { Ref: 'serviceUserPoolClient' },
    Export: {
      Name: '${self:custom.stage}-UserPoolClientId',
    },
  },
  UserPoolClientSecretOutput: {
    Value: { 'Fn::GetAtt': ['serviceUserPoolClient', 'ClientSecret'] },
    Export: {
      Name: '${self:custom.stage}-UserPoolClientSecret',
    },
  },
};

const serverlessConfiguration: AWS = {
  service: 'serverless-typescript-template',
  frameworkVersion: '2',
  custom: {
    stage: '${opt:stage, self:provider.stage, "dev"}',
    esbuild: {
      packager: 'npm',
      bundle: true,
      minify: false,
      sourcemap: true,
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      external: externals,
    },
    userPoolName: 'service-user-pool-${self:custom.stage}',
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
    iam: {
      role: {
        statements: [
          { Effect: 'Allow', Action: 'dynamodb:PutItem', Resource: { 'Fn::GetAtt': ['UserTable', 'Arn'] } },
          { Effect: 'Allow', Action: 'dynamodb:UpdateItem', Resource: { 'Fn::GetAtt': ['UserTable', 'Arn'] } },
          { Effect: 'Allow', Action: 'dynamodb:GetItem', Resource: { 'Fn::GetAtt': ['UserTable', 'Arn'] } },
        ],
      },
    },
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
  resources: {
    Resources: {
      HttpApi: {
        Type: 'AWS::ApiGatewayV2::Api',
        DependsOn: ['serviceUserPool'],
      },
      serviceUserPool,
      serviceUserPoolClient,
      serviceUserPoolDomain,
      UserTable,
    },
    Outputs,
  },
  functions,
};

module.exports = serverlessConfiguration;
