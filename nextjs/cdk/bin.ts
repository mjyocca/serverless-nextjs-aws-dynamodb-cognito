import 'source-map-support/register';
import { App } from '@aws-cdk/core';
import { Builder } from '@sls-next/lambda-at-edge';
import { NextStack } from './stack';

const builder = new Builder('.', './build', { args: ['build'] });

builder
  .build(true)
  .then(() => {
    const app = new App();
    new NextStack(app, 'NextJsAppStack', {
      env: {
        region: 'us-east-1',
      },
      analyticsReporting: true,
      description: 'Testing deploying NextJS Serverless Construct',
    });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
