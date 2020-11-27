/* eslint-disable import/prefer-default-export */
import { Stack, StackProps, Construct, SecretValue } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';

import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';

export class CdkpipelinesDemoPipelineStack extends Stack {
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
  }
}
