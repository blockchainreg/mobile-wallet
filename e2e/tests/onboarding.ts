import { $, app } from 'detoxer';

describe('Welcome', () => {
  beforeAll(async () => {
    await app.launchWithPermissions();
    await device.setURLBlacklist(['.*']);
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    await $('Setup Password').wait();
  });

  it('create account', async () => {
    await $('#passwordInputOnSignup').type('123456');
    await $('Next').tap();

    await $('Create').tap();
    await $('Accept').tap();

    await $('Wallets').wait();
    await $('Balance').wait();
    await $('Please save your seed phrase!!').wait();
  });

  describe('login to existing account', () => {
    beforeEach(async () => {
      await device.uninstallApp();
      await device.installApp();
      await app.launchWithPermissions();
      await device.setURLBlacklist(['.*']);
    });

    // TODO:
    xit('12 words', async () => {
      await $('#passwordInputOnSignup').type('123456');
      await $('Next').tap();

      await $('Restore').tap();
      await $('12 words').tap();
    });

    // TODO:
    xit('24 words', async () => {
      await $('#passwordInputOnSignup').type('123456');
      await $('Next').tap();

      await $('Create').tap();
      await $('Accept').tap();

      await $('Wallets').wait();
      await $('Balance').wait();
      await $('Please save your seed phrase!!').wait();
    });

    it('custom ', async () => {
      await $('#passwordInputOnSignup').type('123456');
      await $('Next').tap();

      await $('Restore').tap();
      await $('Custom').tap();
      await $('#restoreSeedPhraseInput').type('test seed 13');
      await $('Next').tap();

      await $('Wallets').wait();
      await $('Balance').wait();
    });
  });
});

// #passwordInputOnLocked
