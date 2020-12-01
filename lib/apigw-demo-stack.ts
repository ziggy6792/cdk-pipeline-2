import * as cdk from '@aws-cdk/core';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import { ServicePrincipal } from '@aws-cdk/aws-iam';

class ApigwDemoStack extends cdk.Stack {
  public readonly urlOutput: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, stageName: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // First, create a test lambda
    const handler = new lambda.Function(this, 'lambda', {
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'lambda')),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      environment: {},
    });

    const api = new apigw.LambdaRestApi(this, 'Gateway', {
      description: `Endpoint for lambda ${stageName}`,
      handler,
    });

    // Then create an explicit Deployment construct
    const deployment = new apigw.Deployment(this, 'my_deployment', { api });

    const deployedStage = new apigw.Stage(this, stageName, { deployment, stageName });

    api.deploymentStage = deployedStage;

    this.urlOutput = new cdk.CfnOutput(this, `${id}.url`, { value: api.url });
  }
}

export default ApigwDemoStack;
