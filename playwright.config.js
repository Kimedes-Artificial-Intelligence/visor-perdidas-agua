const {defineConfig,devices}=require('@playwright/test');
module.exports=defineConfig({
  testDir:'tests/browser',
  globalSetup:require.resolve('./tests/browser/setup.js'),
  fullyParallel:true,
  forbidOnly:!!process.env.CI,
  retries:0,
  reporter:process.env.CI?[['list'],['junit',{outputFile:'test-results/junit.xml'}]]:'list',
  use:{...devices['Desktop Chrome'],reducedMotion:'reduce'},
});
