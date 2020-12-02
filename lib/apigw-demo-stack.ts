import * as cdk from '@aws-cdk/core';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import { ServicePrincipal } from '@aws-cdk/aws-iam';

class ApigwDemoStack extends cdk.Stack {
  public readonly urlOutput: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, stageName: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const baseId = `${id}-${stageName}`;
    const lambdaPair = { id: `${baseId}-lambda`, description: `${baseId}-lambda` };
    const apiPair = { id: `${baseId}-api`, description: `${baseId}-api` };
    const stagePair = { id: `${baseId}-stage`, description: `${baseId}-stage` };
    const stageDeployment = { id: `${baseId}-deployment`, description: `${baseId}-deployment` };

    // First, create a test lambda
    const handler = new lambda.Function(this, lambdaPair.id, {
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'lambda')),
      description: lambdaPair.description,
      functionName: lambdaPair.description,
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      environment: {},
    });

    // IMPORTANT: Lambda grant invoke to APIGateway
    handler.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'));

    // Then, create the API construct, integrate with lambda
    const api = new apigw.RestApi(this, apiPair.id, { deploy: false, description: apiPair.description });
    const integration = new apigw.LambdaIntegration(handler);
    api.root.addMethod('ANY', integration);

    // Then create an explicit Deployment construct
    const deployment = new apigw.Deployment(this, stageDeployment.id, { api, description: stageDeployment.description });

    const deployedStage = new apigw.Stage(this, stagePair.id, { deployment, stageName, description: stagePair.description });

    api.deploymentStage = deployedStage;

    this.urlOutput = new cdk.CfnOutput(this, 'webservice-url', { description: 'webservice-url', value: api.url });
  }
}

export default ApigwDemoStack;
