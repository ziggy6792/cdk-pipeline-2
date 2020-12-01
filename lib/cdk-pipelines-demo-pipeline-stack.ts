/* eslint-disable import/prefer-default-export */
import * as cdk from '@aws-cdk/core';

import { Stack, StackProps, Construct, SecretValue } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';

import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import { ManualApprovalAction } from '@aws-cdk/aws-codepipeline-actions';
import { CdkPipelinesDemoStage } from './cdk-pipelines-demo-stage';

export class CdkpipelinesDemoPipelineStack extends Stack {
  public readonly urlOutput: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new CdkPipeline(this, 'CdkPipeline2', {
      pipelineName: 'CdkPipeline2',
      cloudAssemblyArtifact,

      sourceAction: new codepipelineActions.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('GITHUB_OATH_TOKEN', { jsonField: 'GITHUB_OATH_TOKEN' }),
        trigger: codepipelineActions.GitHubTrigger.POLL,
        // Replace these with your actual GitHub project info
        owner: 'ziggy6792',
        repo: 'cdk-pipeline-2',
      }),

      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,

        // Use this if you need a build step (if you're not using ts-node
        // or if you have TypeScript Lambdas that need to be compiled).
        buildCommand: 'npm run build',
      }),
    });

    // Do this as many times as necessary with any account and region
    // Account and region may be different from the pipeline's.
    const devStage = pipeline.addApplicationStage(
      new CdkPipelinesDemoStage(this, 'Dev', {
        env: {
          account: '694710432912',
          region: 'ap-southeast-1',
        },
      })
    );

    // pipeline.

    devStage.addActions(
      new ManualApprovalAction({
        actionName: 'ManualApproval',
        runOrder: devStage.nextSequentialRunOrder(),
      })
    );

    // Do this as many times as necessary with any account and region
    // Account and region may be different from the pipeline's.
    pipeline.addApplicationStage(
      new CdkPipelinesDemoStage(this, 'Prod', {
        env: {
          account: '694710432912',
          region: 'ap-southeast-1',
        },
      })
    );
    this.urlOutput = new cdk.CfnOutput(this, 'testOutput', { value: 'testOutput' });
    // this.urlOutput = service.urlOutput;
  }
}
