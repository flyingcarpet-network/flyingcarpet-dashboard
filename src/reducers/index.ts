import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import MapReducer from './mapReducer';
import ModalsReducer from './modalsReducer';
import ModelReducer from './modelReducer';
import TcroReducer from './tcroReducer';
import Web3Reducer from './web3Reducer';

export default combineReducers ({
  form: formReducer,
  map: MapReducer,
  modals: ModalsReducer,
  models: ModelReducer,
  routing: routerReducer,
  tcro: TcroReducer,
  web3: Web3Reducer
});
