import * as types from '../actions/web3Actions-types';

const INITIAL_STATE = {
  isAnyUnlockedAccount: false,
  networkName: '',
  nitrogenBalance: 0
};

export default function models(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SET_IS_ANY_UNLOCKED_ACCOUNT:
      return {
        ...state,
        isAnyUnlockedAccount: action.isAnyUnlockedAccount
      };
    case types.SET_NETWORK_NAME:
      return {
        ...state,
        networkName: action.networkName
      };
    case types.SET_NITROGEN_BALANCE:
      return {
        ...state,
        nitrogenBalance: action.nitrogenBalance
      };
    default:
      return state;
  }
};
