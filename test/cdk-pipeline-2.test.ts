import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CdkPipeline2 from '../lib/cdk-pipeline-2-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new CdkPipeline2.CdkPipelinesStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT
    )
  );
});
