import * as types from './tcroActions-types';

export const setBounties = (bountiesArray: any[]) => (
  {
    bounties: bountiesArray,
    type: types.SET_BOUNTIES
  }
);
