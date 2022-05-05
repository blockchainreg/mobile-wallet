import { app, $ } from 'detoxer';

describe('Welcome', () => {
  beforeAll(async () => {
    await app.launchWithPermissions();
  });

  it('should have welcome screen', async () => {
    await $('Setup Password').wait();
  });
});
