import fetch from 'cross-fetch';
import { cachedCallWithRetries } from './utils';

export const getStakingAccountsFromBackend = async ({ validatorsBackend }) => {
  const nativeAccountsFromBackendResult = await fetch(
    `${validatorsBackend}/v1/staking-accounts`
  );
  const nativeAccounts = await nativeAccountsFromBackendResult.json();
  const stakingAccounts = nativeAccounts ? nativeAccounts.stakingAccounts : [];

  return stakingAccounts;
};

export const getStakingAccountsFromBackendCachedWithRetries = async ({
  network,
  validatorsBackend,
}) =>
  await cachedCallWithRetries(
    network,
    ['getStakingAccountsFromBackend'],
    async () => await getStakingAccountsFromBackend({ validatorsBackend }),
    5
  );
