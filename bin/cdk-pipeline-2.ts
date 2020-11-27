#!/usr/bin/env node
/* eslint-disable no-new */

import * as cdk from '@aws-cdk/core';
import { CdkpipelinesDemoPipelineStack } from '../lib/cdk-pipelines-demo-pipeline-stack';

import 'source-map-support/register';

const app = new cdk.App();
new CdkpipelinesDemoPipelineStack(app, 'CdkPipeline2Stack', {
  env: {
    account: '694710432912',
    region: 'ap-southeast-1',
  },
});
