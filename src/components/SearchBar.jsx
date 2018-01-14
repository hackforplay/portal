import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import grey from 'material-ui/colors/grey';
import SearchIcon from 'material-ui-icons/Search';

import { searchBarInfo } from '../settings/siteMap';

type Props = {
  classes: {
    toolbar: string,
    blank: string,
    icon: string
  }
} & ContextRouter;

type State = {};

@withRouter
@withStyles({
  toolbar: {
    minHeight: 48 // 上下のマージンをなくす
  },
  blank: {
    flex: 1
  },
  icon: {
    width: 18,
    marginRight: 12
  }
})
class SearchBar extends React.Component<Props, State> {
  static propTyeps = {
    classes: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    const { classes, location } = this.props;

    // 現在表示している URL にふさわしいタブの状態を取得する
    const info = searchBarInfo.find(item => {
      const re = pathToRegexp(item.path);
      return re.exec(location.pathname);
    });

    if (!info) {
      // TODO: アニメーション
      return null;
    }

    // 現在のタブの位置を取得する
    const tabIndex = info.tabs.findIndex(item => item.to === location.pathname);

    return (
      <AppBar position="static" color="default">
        <Toolbar className={classes.toolbar}>
          {info.text && <Typography type="title">{info.text}</Typography>}
          <Tabs value={tabIndex} indicatorColor="primary">
            {info.tabs.map(tab => (
              <Tab
                key={tab.text}
                label={tab.text}
                component={Link}
                to={tab.to}
              />
            ))}
          </Tabs>
          <div className={classes.blank} />
          <IconButton aria-label="Search">
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}

export default SearchBar;
