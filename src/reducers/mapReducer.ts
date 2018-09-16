import * as types from '../actions/mapActions-types';

const INITIAL_STATE = {
  // TO-DO: These are London coordinates, the code should allow an empty
  // 'currentPlace' so that it defaults to the user's inferred location
  center: [-0.1275, 51.50722],
  searchTerm: '',
  mapClickLocation: [], // An array of lat/lon coordinates for the last location the user clicked on the map
  // For bounty contribution dialog modal
  bountyStakeAmount: 0, // The amount of NTN token to stake
  selectedBountyToStake: 0, // The ID of the selected bounty (when the staking modal is opened)
  bountyStakedSuccessfully: false // Set to true right after a bounty has just been staked, then reset to false
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
    case types.SET_MAP_CLICK_LOCATION:
      return {
        ...state,
        mapClickLocation: action.mapClickLocation
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
    case types.TOGGLE_BOUNTY_STAKED_SUCCESSFULLY:
      return {
        ...state,
        bountyStakedSuccessfully: !state.bountyStakedSuccessfully
      };
    default:
      return state;
  }
};
