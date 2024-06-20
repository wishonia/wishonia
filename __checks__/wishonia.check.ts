/**
* This is a Checkly CLI BrowserCheck construct. To learn more, visit:
* - https://www.checklyhq.com/docs/cli/
* - https://www.checklyhq.com/docs/cli/constructs-reference/#browsercheck
*/

import { BrowserCheck, Frequency, RetryStrategyBuilder } from 'checkly/constructs'

new BrowserCheck('wishonia', {
  name: 'wishonia',
  activated: true,
  muted: false,
  shouldFail: false,
  runParallel: false,
  locations: ['us-east-2', 'us-east-1'],
  tags: [],
  sslCheckDomain: '',
  frequency: Frequency.EVERY_24H,
  environmentVariables: [],
  code: {
    entrypoint: './homepage.spec.ts',
  },
  retryStrategy: RetryStrategyBuilder.fixedStrategy({
    baseBackoffSeconds: 0,
    maxRetries: 1,
    maxDurationSeconds: 600,
    sameRegion: false,
  }),
})
