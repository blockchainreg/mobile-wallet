import fetch from 'cross-fetch';
import { cachedCallWithRetries } from './utils';

export const getStakingAccountsFromBackend = async ({
  validatorsBackend,
  params,
}) => {
  const nativeAccountsFromBackendResult = await fetch(
    `${validatorsBackend}/v1/staking-accounts?` +
      new URLSearchParams({
        staker: params?.staker,
      })
  );
  const nativeAccounts = await nativeAccountsFromBackendResult.json();
  const stakingAccounts = nativeAccounts ? nativeAccounts.stakingAccounts : [];

  return stakingAccounts;
};

export const getStakingAccountsFromBackendCachedWithRetries = async ({
  network,
  validatorsBackend,
  params,
}) =>
  await cachedCallWithRetries(
    network,
    ['getStakingAccountsFromBackend', validatorsBackend, params],
    async () =>
      await getStakingAccountsFromBackend({ validatorsBackend, params }),
    5
  );
