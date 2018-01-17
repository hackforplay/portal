import * as React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
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
          {info.text && <Typography type="title">{info.text}</Typography>}
          <Tabs
            value={selected && selected.to}
            indicatorColor="primary"
            onChange={this.handleChangeTab}
          >
            {info.tabs.map(tab => (
              <Tab key={tab.to} label={tab.text} value={tab.to} />
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
