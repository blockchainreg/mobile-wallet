module.exports = {
  reporters: [
    'detox/runners/jest/streamlineReporter',
    [
      'jest-stare',
      {
        log: true,
        reportTitle: 'mobile wallet test report',
        resultDir: process.env.REPORT_DIR,
      },
    ],
  ],
  testEnvironment: './environment',
  testRunner: 'jest-circus/runner',
  testTimeout: 60000,
  testRegex: '\\.test\\.(js|ts)$',
  verbose: true,
  // setupFilesAfterEnv: ['./jest-e2e.setup.js'],
  bail: 1,
  verbose: true,
  maxWorkers: 1,
};
