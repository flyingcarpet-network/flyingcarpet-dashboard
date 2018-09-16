import * as types from './mapActions-types';

export const setCenter = (center: [number, number]) => (
  {
    center,
    type: types.SET_CENTER
  }
);

export const setSearchTerm = (searchTerm: string) => (
  {
    searchTerm,
    type: types.SET_SEARCH_TERM
  }
);

export const setBountyStakeAmount = (bountyStakeAmount: number) => (
  {
    bountyStakeAmount,
    type: types.SET_BOUNTY_STAKE_AMOUNT
  }
);

export const setSelectedBountyToStake = (selectedBountyToStake: number) => (
  {
    selectedBountyToStake,
    type: types.SET_SELECTED_BOUNTY_TO_STAKE
  }
);

export const toggleBountyStakedSuccessfully = () => (
  {
    type: types.TOGGLE_BOUNTY_STAKED_SUCCESSFULLY
  }
);
