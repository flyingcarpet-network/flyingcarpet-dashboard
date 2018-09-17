import * as types from './tcroActions-types';

export const setBounties = (bountiesArray: any[]) => (
  {
    bounties: bountiesArray,
    type: types.SET_BOUNTIES
  }
);

export const setStakingPoolSize = (stakingPoolSize: any[]) => (
  {
    stakingPoolSize,
    type: types.SET_STAKING_POOL_SIZE
  }
);
