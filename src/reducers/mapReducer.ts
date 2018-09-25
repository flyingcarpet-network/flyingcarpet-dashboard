import * as types from '../actions/mapActions-types';
import { BountyFilter, TxnStates } from './dataTypeEnums';

const INITIAL_STATE = {
  // TO-DO: These are London coordinates, the code should allow an empty
  // 'currentPlace' so that it defaults to the user's inferred location
  center: [-0.1275, 51.50722],
  searchTerm: '',
  mapSelectedPolygonPoints: [], // An array of lat/lon coordinates for the last location the user clicked on the map
  // For bounty contribution dialog modal
  bountyStakeAmount: 0, // The amount of NTN token to stake
  selectedBountyToStake: 0, // The ID of the selected bounty (when the staking modal is opened)
  // TODO: These two flags (below) should be abstracted into their own reducers
  bountyStakingTxnState: TxnStates.DEFAULT, // Set to DEFAULT before a bounty has just been staked
  bountySubmissionTxnState: TxnStates.DEFAULT, // Set to DEFAULT before a bounty has just been added
  lastSuccessfulBountyTxnHash: '', // The hash of the last bounty successfully added
  bountyFilter: BountyFilter.ALL
};

export default function models(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SET_CENTER:
      return {
        ...state,
        center: action.center
      };
    case types.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.searchTerm
      };
    case types.SET_MAP_POLYGON_POINTS:
      return {
        ...state,
        mapSelectedPolygonPoints: action.mapSelectedPolygonPoints
      };
    case types.SET_BOUNTY_STAKE_AMOUNT:
      return {
        ...state,
        bountyStakeAmount: action.bountyStakeAmount
      };
    case types.SET_SELECTED_BOUNTY_TO_STAKE:
      return {
        ...state,
        selectedBountyToStake: action.selectedBountyToStake
      };
    case types.SET_BOUNTY_STAKING_TXN_STATE:
      return {
        ...state,
        bountyStakingTxnState: action.bountyStakingTxnState
      };
    case types.SET_BOUNTY_SUBMISSION_TXN_STATE:
      return {
        ...state,
        bountySubmissionTxnState: action.bountySubmissionTxnState
      };
    case types.SET_BOUNTY_FILTER:
      return {
        ...state,
        bountyFilter: action.bountyFilter
      };
    case types.SET_LAST_SUCCESSFUL_BOUNTY_TXN_HASH:
      return {
        ...state,
        lastSuccessfulBountyTxnHash: action.lastSuccessfulBountyTxnHash
      };
    default:
      return state;
  }
};
