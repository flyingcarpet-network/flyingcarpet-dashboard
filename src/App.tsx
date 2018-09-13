import * as React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import './App.css';
import Main from './containers/main';
import configureStore, { history } from './store';

export const store = configureStore ();

export default class App extends React.Component {
  public render() {
    return(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
                <Route path="/" component={Main} />
            </Switch>
        </ConnectedRouter>
      </Provider>
    )
  }
}
