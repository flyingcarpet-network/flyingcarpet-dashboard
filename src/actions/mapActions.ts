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
