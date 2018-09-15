import * as types from '../actions/tcroActions-types';

const INITIAL_STATE = {
  bounties: []
};

export default function tcro(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SET_BOUNTIES:
      return {
      	...state,
      	bounties: action.bounties
      };
    default:
      return state;
  }
};
