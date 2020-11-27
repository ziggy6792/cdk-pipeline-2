#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkPipelinesStack } from '../lib/cdk-pipeline-2-stack';

const app = new cdk.App();
new CdkPipelinesStack(app, 'CdkPipeline2Stack', {
  env: {
    account: '694710432912',
    region: 'ap-southeast-1',
  },
});
