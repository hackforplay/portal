// @flow
import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from 'material-ui-icons/Search';
import ArrowBack from 'material-ui-icons/ArrowBack';
import { grey } from '@material-ui/core/colors';
import { style } from 'typestyle';

import { searchBarInfo } from '../settings/siteMap';

const cn = {
  toolbar: style({
    minHeight: 48, // 上下のマージンをなくす
    backgroundColor: grey[50]
  }),
  blank: style({
    flex: 1
  }),
  icon: style({
    width: 18,
    marginRight: 12
  }),
  tabs: style({
    flexGrow: 999
  })
};

export type OwnProps = {};
type Props = OwnProps & { ...ContextRouter };

@withRouter
class NavigationBar extends React.Component<Props> {
  handleChangeTab = (event: SyntheticEvent<any>, value: string) => {
    const { location, history } = this.props;

    // 現在表示している URL にふさわしいタブの状態を取得する
    const info = searchBarInfo.find(item => {
      const re = pathToRegexp(item.path);
      return re.exec(location.pathname);
    });

    if (!info) {
      throw new Error(`No serchBarInfo is given in ${location.pathname}`);
    }

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
    const { location } = this.props;

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
        <Toolbar className={cn.toolbar}>
          {info.backTo ? (
            <IconButton aria-label="Back" component={Link} to={info.backTo}>
              <ArrowBack />
            </IconButton>
          ) : null}

          {info.text && <Typography variant="h5">{info.text}</Typography>}
          {selected && (
            <Tabs
              value={selected.to}
              indicatorColor="primary"
              onChange={this.handleChangeTab}
              scrollable
              scrollButtons="auto"
              className={cn.tabs}
            >
              {info.tabs.map(tab => (
                <Tab key={tab.to} label={tab.text} value={tab.to} />
              ))}
            </Tabs>
          )}
          <div className={cn.blank} />
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
