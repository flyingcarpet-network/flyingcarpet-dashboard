import { BountyFilter, TxnStates } from '../reducers/dataTypeEnums';
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

export const setMapClickLocation = (mapClickLocation: [any,any]) => (
  {
    mapClickLocation,
    type: types.SET_MAP_CLICK_LOCATION
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

export const setBountyStakingTxnState = (bountyStakingTxnState: TxnStates) => (
  {
    bountyStakingTxnState,
    type: types.SET_BOUNTY_STAKING_TXN_STATE
  }
);

export const setBountySubmissionTxnState = (bountySubmissionTxnState: TxnStates) => (
  {
    bountySubmissionTxnState,
    type: types.SET_BOUNTY_SUBMISSION_TXN_STATE
  }
);

export const setBountyFilter = (bountyFilter: BountyFilter) => (
  {
  	bountyFilter,
    type: types.SET_BOUNTY_FILTER
  }
);

export const setLastSuccessfulBountyTxnHash = (lastSuccessfulBountyTxnHash: string) => (
  {
    lastSuccessfulBountyTxnHash,
    type: types.SET_LAST_SUCCESSFUL_BOUNTY_TXN_HASH
  }
);
