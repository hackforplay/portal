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
import Work from '../containers/Work';
import Profile from '../containers/Profile';
import OptionalHeader from '../containers/OptionalHeader';

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <div>
          <Route component={Header} />
          <Route path="/users/:id/:tab?" component={Profile} />
          <Route component={SearchBar} />
          <Route component={OptionalHeader} />
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
          <Route path="/works/:id" exact component={Work} />
          <Route path="/users/:id/:tab?/:query?" component={User} />
        </div>
      </Router>
    </MuiThemeProvider>
  );
}

export default withStyles({})(App);
