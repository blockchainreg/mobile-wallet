import { $, app } from 'detoxer';
import { testData } from '../test-data';

describe('Balances', () => {
  beforeAll(async () => {
    await app.launchWithPermissions();
    await device.setURLBlacklist(['.*']);
  });

  beforeEach(async () => {
    await device.uninstallApp();
    await device.installApp();
    await app.launchWithPermissions();
    await device.setURLBlacklist(['.*']);
  });

  it('balances should be displayed', async () => {
    await $('#passwordInputOnSignup').type('123456');
    await $('Next').tap();

    await $('Restore').tap();
    await $('Custom').tap();
    await $('#restoreSeedPhraseInput').type(testData.accounts.withFunds.seed);
    await $('Next').tap();

    await $('Wallets').wait();
    await $('Balance').wait();

    // TODO
    // await $('#walletsList').wait();
  });
});
