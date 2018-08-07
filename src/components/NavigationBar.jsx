// @flow
import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';
import ArrowBack from 'material-ui-icons/ArrowBack';
import { grey } from 'material-ui/colors';

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
    minHeight: 48, // 上下のマージンをなくす
    backgroundColor: grey[50]
  },
  blank: {
    flex: 1
  },
  icon: {
    width: 18,
    marginRight: 12
  }
})
class NavigationBar extends React.Component<Props, State> {
  handleChangeTab = (event, value: string) => {
    const { location, history } = this.props;

    // 現在表示している URL にふさわしいタブの状態を取得する
    const info = searchBarInfo.find(item => {
      const re = pathToRegexp(item.path);
      return re.exec(location.pathname);
    });

    const keys = [];
    const re = pathToRegexp(info.path, keys);
    const params = re.exec(location.pathname);

    const data = keys.reduce((p, c, i) => {
      return { ...p, [`${c.name}`]: params[i + 1] };
    }, {});
    const toPath = pathToRegexp.compile(value);
    const url = toPath(data);

    history.push(url);
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
    const selected = info.tabs.find(item =>
      pathToRegexp(item.to).exec(location.pathname)
    );

    return (
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar className={classes.toolbar}>
          {info.backTo ? (
            <IconButton aria-label="Back" component={Link} to={info.backTo}>
              <ArrowBack />
            </IconButton>
          ) : null}

          {info.text && <Typography type="headline">{info.text}</Typography>}
          {selected && (
            <Tabs
              value={selected.to}
              indicatorColor="primary"
              onChange={this.handleChangeTab}
              scrollable
              scrollButtons="auto"
              style={{ flexGrow: 999 }}
            >
              {info.tabs.map(tab => (
                <Tab key={tab.to} label={tab.text} value={tab.to} />
              ))}
            </Tabs>
          )}
          <div className={classes.blank} />
          {info.searchTo ? (
            <IconButton aria-label="Search" component={Link} to={info.searchTo}>
              <SearchIcon />
            </IconButton>
          ) : null}
        </Toolbar>
      </AppBar>
    );
  }
}

export default NavigationBar;
