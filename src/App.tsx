import * as React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import Web3Provider from 'react-web3-provider';
import './App.css';
import Main from './containers/main';
import configureStore, { history } from './store';

export const store = configureStore ();

export default class App extends React.Component {
  public render() {
    return(
      <Web3Provider
        loading="Loading..."
        error={this.handleError}
      >
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Switch>
              <Route path="/" component={Main} />
            </Switch>
          </ConnectedRouter>
        </Provider>
      </Web3Provider>
    )
  }
  private handleError(err) {
    // Handle any errors with the Web3 provider
    return `Connection error: ${err.message}`;
  }
}
