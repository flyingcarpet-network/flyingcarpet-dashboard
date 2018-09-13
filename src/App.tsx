import * as React from 'react';
import { Provider } from 'react-redux';
import { browserHistory, Route, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Web3Provider from 'react-web3-provider';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import './App.css';
import Main from './containers/main';
import rootReducer from './reducers';

declare var Web3; // To prevent TypeScript from complaining about undefined Web3 variable below

const middlewares: any[] = [ thunk ];

const store = createStore(rootReducer, {}, applyMiddleware(...middlewares));
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state: any) => state.routing
});

export default class App extends React.Component {
  public render() {
    return(
      <Web3Provider
        defaultProvider={this.defaultProvider}
        acceptProvider={this.providerAccept}
        loading="Loading..."
        error={this.handleError}
      >
        <Provider store={store}>
          <Router history={history}>
            <Route path="/" component={Main} />
          </Router>
        </Provider>
      </Web3Provider>
    )
  }
  private defaultProvider(cb) {
    // If the user's browser is not Ethereum-enabld, Infura is used to pull the TCRO listings (non-view method calls will not be possible)
    return cb(new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/af835408d5f542c1a22d9f703160b882")));
  }
  private providerAccept(web3, accept, reject) {
    // Used to check if the provider (via MetaMask, etc.) has at least one unlocked account
    web3.eth.getAccounts().then((accounts) => {
      if (accounts.length >= 1) { accept(); }
      else { reject(); }
    });
  }
  private handleError(err) {
    // Handle any errors with the Web3 provider
    return `Connection error: ${err.message}`;
  }
}
