import * as types from '../actions/modalsActions-types';

const INITIAL_STATE = {
  stakingDialog: false,
  aboutDialog: false,
  faucetDialog: false
};

export default function models(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.TOGGLE_STAKING_DIALOG:
      return {
        ...INITIAL_STATE,
        stakingDialog: !state.stakingDialog
      };
    case types.TOGGLE_ABOUT_DIALOG:
      return {
        ...INITIAL_STATE,
        aboutDialog: !state.aboutDialog
      };
    case types.TOGGLE_FAUCET_DIALOG:
      return {
        ...INITIAL_STATE,
        faucetDialog: !state.faucetDialog
      };
    default:
      return state;
  }
};
