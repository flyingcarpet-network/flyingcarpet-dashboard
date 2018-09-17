import * as types from '../actions/tcroActions-types';

const INITIAL_STATE = {
  bounties: [],
  stakingPoolSize: 0
};

export default function tcro(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SET_BOUNTIES:
      return {
      	...state,
      	bounties: action.bounties
      };
    case types.SET_STAKING_POOL_SIZE:
      return {
        ...state,
        stakingPoolSize: action.stakingPoolSize
      };
    default:
      return state;
  }
};
