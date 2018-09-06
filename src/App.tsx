import * as React from 'react';
import { Provider } from 'react-redux';
import { browserHistory, Route, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import './App.css';
import Main from './components/main';
import rootReducer from './reducers';

const middlewares: any[] = [ thunk ];

const store = createStore(rootReducer, {}, applyMiddleware(...middlewares));
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state: any) => state.routing
});

export default class App extends React.Component {
  public render() {
    return(
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={Main} />
        </Router>
      </Provider>
    )
  }
}
