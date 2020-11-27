/* eslint-disable import/prefer-default-export */
import { Construct, Stack, StackProps, Stage, StageProps } from '@aws-cdk/core';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { CdkPipeline } from '@aws-cdk/pipelines';

import * as cdk from '@aws-cdk/core';
import { CdkPipelinesStack } from './cdk-pipeline-2-stack';

export class CdkPipelinesDemoStage extends Stage {
  public readonly urlOutput: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new CdkPipelinesStack(this, 'webservice');

    this.urlOutput = service.urlOutput;
  }
}
