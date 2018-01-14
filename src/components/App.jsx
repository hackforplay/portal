import React from 'react';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import theme from '../settings/theme';
import Header from '../containers/Header';
import User from '../containers/User';
import Topic from '../containers/Topic';
import SearchBar from '../containers/SearchBar';

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <div>
          {/* Commons */}
          <Route component={Header} />
          <Route component={SearchBar} />
          {/* Pages */}
          <Route path="/" exact component={Topic} />
          <Route
            path="/contents/:tab"
            exact
            render={({ match }) => (
              <div>Official contents of {match.params.tab}</div>
            )}
          />
          <Switch>
            <Redirect exact from="/products" to="/lists" />
            <Route
              path="/lists/search/:query?"
              render={({ match }) => (
                <div>Search result of {match.params.query}</div>
              )}
            />
            <Route
              path="/lists/:more?"
              exact
              render={({ match }) => <div>List of {match.params.more}</div>}
            />
          </Switch>
          <Route
            path="/products/:id"
            exact
            render={({ match }) => <div>Product {match.params.id}</div>}
          />
          <Route path="/users/:user" exact component={User} />
          <Route
            path="/users/:user/search/:query?"
            exact
            render={({ match }) => (
              <div>User info with search result of {match.params.query}</div>
            )}
          />
        </div>
      </Router>
    </MuiThemeProvider>
  );
}

export default withStyles({})(App);
