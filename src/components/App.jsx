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
import Contents from '../containers/Contents';
import WorkLists from '../containers/WorkLists';

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
          <Route path="/contents/:tab" exact component={Contents} />
          <Switch>
            <Redirect exact from="/works" to="/lists" />
            <Route
              path="/lists/search/:query?"
              render={({ match }) => (
                <div>Search result of {match.params.query}</div>
              )}
            />
            <Route path="/lists/:more?" exact component={WorkLists} />
          </Switch>
          <Route
            path="/works/:id"
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
