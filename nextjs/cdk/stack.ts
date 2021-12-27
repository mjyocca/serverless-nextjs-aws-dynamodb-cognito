import * as cdk from '@aws-cdk/core';
import { Duration } from '@aws-cdk/core';
import { NextJSLambdaEdge } from '@sls-next/cdk-construct';
import { Runtime } from '@aws-cdk/aws-lambda';
import * as cloudfront from '@aws-cdk/aws-cloudfront';

export class NextStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const nextApp = new NextJSLambdaEdge(this, 'NextJsApp', {
      serverlessBuildOutDir: './build',
      runtime: Runtime.NODEJS_12_X,
      memory: 1024,
      timeout: Duration.seconds(30),
      withLogging: true,
      name: {
        apiLambda: `${id}Api`,
        defaultLambda: `Fn${id}`,
        imageLambda: `${id}Image`,
      },
      defaultBehavior: {
        cachePolicy: new cloudfront.CachePolicy(this, 'NextLambdaCache', {
          queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
          headerBehavior: cloudfront.CacheHeaderBehavior.allowList('Authorization'),
          cookieBehavior: {
            behavior: 'all',
          },
          defaultTtl: Duration.seconds(0),
          maxTtl: Duration.days(365),
          minTtl: Duration.seconds(0),
          enableAcceptEncodingBrotli: true,
          enableAcceptEncodingGzip: true,
        }),
      },
    });

    new cdk.CfnOutput(this, 'Domain', {
      value: nextApp.distribution.domainName,
      description: 'CloudFrontDomain',
    });
    new cdk.CfnOutput(this, 'ID', {
      value: nextApp.distribution.distributionId,
      description: 'DistributionID',
    });
  }
}
