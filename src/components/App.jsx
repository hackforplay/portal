// @flow
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import MuiThemeProvider from '../containers/MuiThemeProvider';
import Header from '../containers/Header';
import UserWorks from '../containers/UserWorks';
import Topic from '../containers/Topic';
import NavigationBar from '../containers/NavigationBar';
import SearchBar from '../containers/SearchBar';
import Contents from '../containers/Contents';
import FeatureLists from '../containers/FeatureLists';
import Work from '../containers/Work';
import Profile from '../containers/Profile';
import AnonymousProfile from '../containers/AnonymousProfile';
import ProfileEdit from '../containers/ProfileEdit';
import OptionalHeader from '../containers/OptionalHeader';
import SearchList from '../containers/SearchList';
import Sp1 from '../containers/ProgrammingColosseum';
import PCRanking from '../containers/PCRanking';
import MapEditor from '../containers/MapEditor';

const sp1 = `/specials/プログラミングコロシアム`;

export default function App() {
  return (
    <MuiThemeProvider>
      <Router>
        <div>
          <Route component={GoogleTagManager} />
          <Route component={Slaask} />
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
          <Route
            path="/(works|products|officials)/:id?/:action?"
            exact
            component={Work}
          />
          <Route path="/users/:id/:tab?/:query?" component={UserWorks} />
          <Route path="/map-editor" component={MapEditor} />
          <Route path="/maps/:id" component={MapEditor} />

          <Route path={sp1} exact component={Sp1} />
          <Route path={`${sp1}/ranking/:stage`} component={PCRanking} />
          <Route component={Contents} />
        </div>
      </Router>
    </MuiThemeProvider>
  );
}

// Send page view to Google Analytics
function GoogleTagManager({ location }) {
  if (window.gtag) {
    window.gtag('config', process.env.REACT_APP_GA_TRACKING_ID, {
      page_path: location.pathname
    });
  }
  return null;
}

// Send current page to Slaask
function Slaask({ location }) {
  if (window._slaask) {
    window._slaask.updateVisitorInfos({
      current_page: window.location.origin + location.pathname + location.hash
    });
  }
  return null;
}
