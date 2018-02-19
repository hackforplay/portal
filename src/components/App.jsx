// @flow
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
import UserWorks from '../containers/UserWorks';
import Topic from '../containers/Topic';
import NavigationBar from '../containers/NavigationBar';
import SearchBar from '../containers/SearchBar';
import Contents from '../containers/Contents';
import FeatureLists from '../containers/FeatureLists';
import PublishedWork from '../containers/PublishedWork';
import Profile from '../containers/Profile';
import AnonymousProfile from '../containers/AnonymousProfile';
import ProfileEdit from '../containers/ProfileEdit';
import OptionalHeader from '../containers/OptionalHeader';
import SearchList from '../containers/SearchList';
import Pickup from '../containers/Pickup';
import OfficialWork from '../containers/OfficialWork';
import Sp1 from '../containers/ProgrammingColosseum';
import PCRanking from '../containers/PCRanking';

const sp1 = `/specials/プログラミングコロシアム`;

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <div>
          <Route component={Header} />
          <Switch>
            <Route path="/users/:id/edit" component={ProfileEdit} />
            <Route path="/users/:id/:tab?" component={Profile} />
          </Switch>
          <Route path="/anonymous/:nickname" component={AnonymousProfile} />
          <Route path="/anonymous/:query?" component={SearchList} />
          <Switch>
            <Route path="/lists/search/:query?" component={SearchBar} />
            <Route component={NavigationBar} />
          </Switch>
          <Route component={OptionalHeader} />
          <Route path="/" exact component={Topic} />
          <Switch>
            <Redirect exact from="/works" to="/lists" />
            <Route path="/lists/search/:query?" component={SearchList} />
            <Route path="/lists/:more?" exact component={FeatureLists} />
          </Switch>
          <Route path="/pickup" exact component={Pickup} />
          <Route path="/products/:search" exact component={PublishedWork} />
          <Route path="/officials" component={OfficialWork} />
          <Route path="/users/:id/:tab?/:query?" component={UserWorks} />
          <Route path={sp1} exact component={Sp1} />
          <Route path={`${sp1}/ranking/:stage`} component={PCRanking} />
          <Route component={Contents} />
        </div>
      </Router>
    </MuiThemeProvider>
  );
}

export default withStyles({})(App);
