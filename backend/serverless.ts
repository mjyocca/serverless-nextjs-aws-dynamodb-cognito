import type { AWS } from '@serverless/typescript';
import functions from '@functions/index';
import { execSync } from 'child_process';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

type AWSResources = AWS['resources'];
type AWSOutputs = AWSResources['Outputs'];

const [{ dependencies }]: [{ dependencies: Record<string, any> }] = JSON.parse(
  execSync('pnpm ls --prod --json').toString()
);

const externals = Object.entries(dependencies).reduce((acc: string[], [name, dep]) => {
  if (!dep.version.startsWith('link:')) acc.push(name);
  return acc;
}, []);

const cognitoCSS = fs
  .readFileSync('cognito.css', 'utf8')
  .replace(/(\r\n\t|\n|\r\t)/gm, '')
  .replace('/*.+?*/', '');

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

const userPoolUICustomization = {
  Type: 'AWS::Cognito::UserPoolUICustomizationAttachment',
  Properties: {
    UserPoolId: {
      Ref: 'serviceUserPool',
    },
    ClientId: {
      Ref: 'serviceUserPoolClient',
    },
    CSS: cognitoCSS,
  },
};

const httpApiCors = {
  allowedOrigins: ['http://localhost:3000'],
  allowCredentials: true,
  maxAge: 86400,
};

if (process.env.APP_URL) {
  serviceUserPoolClient.Properties.CallbackURLs.push('${env:APP_URL}/api/auth/callback/cognito');
} else {
  console.warn(
    `After deploying the nextjs package, re-deploy this package adding 'APP_URL' to .env file with the value of cloudfront distribution dns address. If using registered domain this step is not required.`
  );
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

const InvokeCustomLambda = {
  Type: 'Custom::InvokeCustomLambda',
  DependsOn: ['UserPoolClientSecretLambdaFunction'],
  Properties: {
    ServiceToken: {
      'Fn::GetAtt': ['UserPoolClientSecretLambdaFunction', 'Arn'],
    },
    userpoolId: { Ref: 'serviceUserPool' },
    clientId: { Ref: 'serviceUserPoolClient' },
  },
};

const SSMParams = {
  cognitoUserPoolId: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Name: '/${opt:stage}/cognito/poolId',
      Type: 'String',
      Value: { Ref: 'serviceUserPool' },
    },
  },
  cognitoUserPoolClientId: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Name: '/${opt:stage}/cognito/clientId',
      Type: 'String',
      Value: { Ref: 'serviceUserPoolClient' },
    },
  },
  cognitoUserPoolClientSecret: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Name: '/${opt:stage}/cognito/clientSecret',
      Type: 'String',
      Value: { 'Fn::GetAtt': ['InvokeCustomLambda', 'clientSecret'] },
    },
  },
  apiGatewayURL: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Name: '/${opt:stage}/api/url',
      Type: 'String',
      Value: {
        'Fn::Join': [
          '',
          ['https://', { Ref: 'HttpApi' }, '.execute-api.${opt:region, self:provider.region}.amazonaws.com'],
        ],
      },
    },
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
};

const resources: AWS['resources'] = {
  Resources: {
    HttpApi: {
      Type: 'AWS::ApiGatewayV2::Api',
      DependsOn: ['serviceUserPool'],
    },
    serviceUserPool,
    serviceUserPoolClient,
    userPoolUICustomization,
    serviceUserPoolDomain,
    UserTable,
    InvokeCustomLambda,
    ...SSMParams,
  },
  Outputs,
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
      DOMAIN_SUFFIX: '${env:DOMAIN_SUFFIX}',
      APP_URL: '${env:APP_URL}',
    },
    region: 'us-east-1',
    lambdaHashingVersion: '20201221',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 'cognito-idp:DescribeUserPoolClient',
            Resource: { 'Fn::GetAtt': ['serviceUserPool', 'Arn'] },
          },
          { Effect: 'Allow', Action: 'dynamodb:PutItem', Resource: { 'Fn::GetAtt': ['UserTable', 'Arn'] } },
          { Effect: 'Allow', Action: 'dynamodb:UpdateItem', Resource: { 'Fn::GetAtt': ['UserTable', 'Arn'] } },
          { Effect: 'Allow', Action: 'dynamodb:GetItem', Resource: { 'Fn::GetAtt': ['UserTable', 'Arn'] } },
        ],
      },
    },
    httpApi: {
      payload: '2.0',
      cors: httpApiCors,
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
  resources,
  functions,
};

module.exports = serverlessConfiguration;
