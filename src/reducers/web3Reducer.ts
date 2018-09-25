import * as types from '../actions/web3Actions-types';
import { TxnStates } from './dataTypeEnums';

const INITIAL_STATE = {
  isAnyUnlockedAccount: false,
  networkName: '',
  nitrogenBalance: 0,
  nitrogenMintTxnState: TxnStates.DEFAULT, // Set to DEFAULT before minting has occured
  lastSuccessfulMintTxnHash: ''
};

export default function web3(state = INITIAL_STATE, action) {
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
    case types.SET_NITROGEN_MINT_TXN_STATE:
      return {
        ...state,
        nitrogenMintTxnState: action.nitrogenMintTxnState
      };
    case types.SET_LAST_SUCCESSFUL_MINT_TXN_HASH:
      return {
        ...state,
        lastSuccessfulMintTxnHash: action.lastSuccessfulMintTxnHash
      };
    default:
      return state;
  }
};
