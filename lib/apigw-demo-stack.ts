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
    const myLambda = new lambda.Function(this, 'lambda', {
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'lambda')),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      environment: {},
    });

    // IMPORTANT: Lambda grant invoke to APIGateway
    myLambda.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));

    // Then, create the API construct, integrate with lambda
    const api = new apigw.RestApi(this, 'my_api', { deploy: false });
    const integration = new apigw.LambdaIntegration(myLambda);
    api.root.addMethod('ANY', integration);

    // Then create an explicit Deployment construct
    const deployment = new apigw.Deployment(this, 'my_deployment', { api });

    const deployedStage = new apigw.Stage(this, `${stageName}_stage`, { deployment, stageName });

    api.deploymentStage = deployedStage;

    this.urlOutput = new cdk.CfnOutput(this, `${id}-${stageName}`, { value: api.url, exportName: `${id}-${stageName}` });
  }
}

export default ApigwDemoStack;
