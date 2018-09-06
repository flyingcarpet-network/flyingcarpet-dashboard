import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import TcroReducer from './tcroReducer';
import ModelReducer from './modelReducer';

export default combineReducers ({
  models: ModelReducer,
  routing: routerReducer,
  tcro: TcroReducer
});
