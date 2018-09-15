import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import MapReducer from './mapReducer';
import ModelReducer from './modelReducer';
import TcroReducer from './tcroReducer';
import Web3Reducer from './web3Reducer';

export default combineReducers ({
  map: MapReducer,
  models: ModelReducer,
  routing: routerReducer,
  tcro: TcroReducer,
  web3: Web3Reducer
});
