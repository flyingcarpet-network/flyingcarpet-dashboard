import { TxnStates } from '../reducers/dataTypeEnums';
import * as types from './web3Actions-types';

export const setIsAnyUnlockedAccount = (isAnyUnlockedAccount: boolean) => (
  {
    isAnyUnlockedAccount,
    type: types.SET_IS_ANY_UNLOCKED_ACCOUNT
  }
);

export const setNetworkName = (networkName: string) => (
  {
    networkName,
    type: types.SET_NETWORK_NAME
  }
);

export const setNitrogenBalance = (nitrogenBalance: number) => (
  {
    nitrogenBalance,
    type: types.SET_NITROGEN_BALANCE
  }
);

export const setNitrogenMintTxnState = (nitrogenMintTxnState: TxnStates) => (
  {
    nitrogenMintTxnState,
    type: types.SET_NITROGEN_MINT_TXN_STATE
  }
);

export const setLastSuccessfulMintTxnHash = (lastSuccessfulMintTxnHash: TxnStates) => (
  {
    lastSuccessfulMintTxnHash,
    type: types.SET_LAST_SUCCESSFUL_MINT_TXN_HASH
  }
);
