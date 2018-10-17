// @flow
import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import { CircularProgress } from 'material-ui/Progress';
import SearchIcon from 'material-ui-icons/Search';
import ArrowBack from 'material-ui-icons/ArrowBack';
import { grey } from 'material-ui/colors';
import { fade } from 'material-ui/styles/colorManipulator';
import { style } from 'typestyle';

import { searchBarInfo } from '../settings/siteMap';
import { withTheme } from '@material-ui/core/styles';
import type { StateProps } from '../containers/SearchBar';

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
  })
};
const getCn = props => ({
  wrapper: style({
    fontFamily: props.theme.typography.fontFamily,
    position: 'relative',
    marginRight: props.theme.spacing.unit * 2,
    marginLeft: props.theme.spacing.unit,
    borderRadius: 2,
    background: fade(props.theme.palette.common.black, 0.15),
    '&:hover': {
      background: fade(props.theme.palette.common.black, 0.25)
    },
    '& $input': {
      transition: props.theme.transitions.create('width'),
      width: 200,
      '&:focus': {
        width: 250
      }
    }
  }),
  search: style({
    width: props.theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  input: style({
    font: 'inherit',
    padding: `${props.theme.spacing.unit}px ${props.theme.spacing.unit}px ${
      props.theme.spacing.unit
    }px ${props.theme.spacing.unit * 9}px`,
    border: 0,
    display: 'block',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    background: 'none',
    margin: 0, // Reset for Safari
    color: 'inherit',
    width: '100%',
    '&:focus': {
      outline: 0
    }
  })
});

export type OwnProps = {};
type Props = OwnProps & StateProps & { ...ContextRouter };

@withTheme()
@withRouter
class SearchBar extends React.Component<Props> {
  // "入力 => ディレイ => 検索" のためのタイマー
  searchTimer = null;

  search(query: string) {
    const { location, history } = this.props;

    // 現在表示している URL にふさわしいタブの状態を取得する
    const info = searchBarInfo.find(item => {
      const re = pathToRegexp(item.path);
      return re.exec(location.pathname);
    });

    if (!info) {
      throw new Error(`No description given in ${location.pathname}`);
    }

    const toPath = pathToRegexp.compile(info.path);
    const url = toPath({ query: query || null });

    // ディレイを挟んで検索開始
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      history.push(url);
    }, 1000);
  }

  handleChangeSearch = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const query = event.currentTarget.value;
    this.search(query);
  };

  handlePressKey = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter': {
        const query = event.currentTarget.value;
        this.search(query);
        break;
      }
      default:
        break;
    }
  };

  render() {
    const dcn = getCn(this.props);

    const { match, location, result } = this.props;

    // 現在表示している URL にふさわしいタブの状態を取得する
    const info = searchBarInfo.find(item => {
      const re = pathToRegexp(item.path);
      return re.exec(location.pathname);
    });

    if (!info) {
      // TODO: アニメーション
      return null;
    }

    return (
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar className={cn.toolbar}>
          {info.backTo ? (
            <IconButton aria-label="Back" component={Link} to={info.backTo}>
              <ArrowBack />
            </IconButton>
          ) : null}
          {info.text && <Typography variant="headline">{info.text}</Typography>}
          <div className={cn.blank} />
          <div className={dcn.wrapper}>
            <div className={dcn.search}>
              {result.isProcessing ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                <SearchIcon />
              )}
            </div>
            <input
              id="docsearch-input"
              className={dcn.input}
              type="text"
              defaultValue={match.params.query}
              onChange={this.handleChangeSearch}
              onKeyPress={this.handlePressKey}
            />
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

export default SearchBar;
