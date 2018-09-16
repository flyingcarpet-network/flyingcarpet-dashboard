import * as types from '../actions/mapActions-types';

const INITIAL_STATE = {
  // TO-DO: These are London coordinates, the code should allow an empty
  // 'currentPlace' so that it defaults to the user's inferred location
  center: [-0.1275, 51.50722],
  searchTerm: '',
  mapClickLocation: [] // An array of lat/lon coordinates for the last location the user clicked on the map
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
    default:
      return state;
  }
};
