// @flow
import * as React from 'react';
import { withRouter, Link } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import { CircularProgress } from 'material-ui/Progress';
import SearchIcon from 'material-ui-icons/Search';
import ArrowBack from 'material-ui-icons/ArrowBack';
import { grey } from 'material-ui/colors';
import { fade } from 'material-ui/styles/colorManipulator';

import { searchBarInfo } from '../settings/siteMap';
import theme from '../settings/theme';
import type { WorkCollectionType } from '../ducks/work';

type Props = {
  classes: {
    toolbar: string,
    blank: string,
    icon: string,
    textField: string
  },
  result: WorkCollectionType
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
  },
  textField: {
    flexGrow: 1,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    backgroundColor: grey[300],
    '&:hover': {
      backgroundColor: grey[500]
    }
  },
  wrapper: {
    fontFamily: theme.typography.fontFamily,
    position: 'relative',
    marginRight: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit,
    borderRadius: 2,
    background: fade(theme.palette.common.black, 0.15),
    '&:hover': {
      background: fade(theme.palette.common.black, 0.25)
    },
    '& $input': {
      transition: theme.transitions.create('width'),
      width: 200,
      '&:focus': {
        width: 250
      }
    }
  },
  search: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    font: 'inherit',
    padding: `${theme.spacing.unit}px ${theme.spacing.unit}px ${
      theme.spacing.unit
    }px ${theme.spacing.unit * 9}px`,
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
  }
})
class SearchBar extends React.Component<Props, State> {
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
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      history.push(url);
    }, 1000);
  }

  handleChangeSearch = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const query = event.target.value;
    this.search(query);
  };

  handlePressKey = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Enter': {
        const query = event.target.value;
        this.search(query);
        break;
      }
      default:
        break;
    }
  };

  render() {
    const { classes, match, location, result } = this.props;

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
        <Toolbar className={classes.toolbar}>
          {info.backTo ? (
            <IconButton aria-label="Back" component={Link} to={info.backTo}>
              <ArrowBack />
            </IconButton>
          ) : null}
          {info.text && <Typography type="headline">{info.text}</Typography>}
          <div className={classes.blank} />
          <div className={classes.wrapper}>
            <div className={classes.search}>
              {result.isProcessing ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                <SearchIcon />
              )}
            </div>
            <input
              id="docsearch-input"
              className={classes.input}
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
