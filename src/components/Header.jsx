// @flow
import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { MenuItem } from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import Button from 'material-ui/Button/Button';
import Select from 'material-ui/Select';
import grey from 'material-ui/colors/grey';
import Home from 'material-ui-icons/Home';

import Avatar from '../containers/Avatar';
import theme from '../settings/theme';
import googleIcon from '../resources/google.svg';
import logo from '../resources/logo.png';
import Beginner from '../icons/Beginner';
import Play from '../icons/Play';
import Create from '../icons/Create';
import type { UserType } from '../ducks/user';

type Props = {
  classes: {
    root: string,
    toolbar: string,
    blank: string,
    icon: string,
    avatar: string,
    title: string,
    separator: string,
    select: string,
    selectIcon: string
  },
  isSignedIn: boolean,
  user: UserType,
  signInWithGoogle: () => {},
  signOut: () => {}
} & ContextRouter;

type State = {
  anchorEl: ?HTMLElement
};

@withRouter
@withStyles({
  root: {
    '@media (min-width:0px) and (orientation: landscape)': {
      height: 48
    },
    '@media (min-width:600px)': {
      height: 64
    },
    height: 56
  },
  toolbar: {
    backgroundColor: grey[900],
    maxHeight: 64,
    overflow: 'hidden'
  },
  blank: {
    flex: 1
  },
  icon: {
    width: 18,
    marginRight: 12
  },
  avatar: {
    cursor: 'pointer',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  title: {
    color: 'black',
    filter: 'invert(100%)'
  },
  separator: {
    position: 'relative',
    display: 'inline-flex',
    minHeight: 36,
    alignSelf: 'center',
    '&:before': {
      content: '""',
      position: 'absolute',
      left: 0,
      backgroundColor: 'white',
      width: 1,
      height: 36
    }
  },
  select: {
    marginLeft: 8,
    marginRight: 8,
    color: 'white'
  },
  selectIcon: {
    color: 'white'
  }
})
class Header extends React.Component<Props, State> {
  state = {
    anchorEl: null
  };

  handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  signInWithGoogle = () => {
    this.props.signInWithGoogle();
    this.handleClose();
  };

  signOut = () => {
    this.props.signOut();
    this.handleClose();
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  goTo = (path: string) => () => {
    const { history } = this.props;
    history.push(path);
    this.handleClose();
  };

  handleVersionChange = (event: {}) => {
    const subDomain = event.target.value;
    const { pathname, search, hash, href } = window.location;
    const url = `https://${subDomain}.hackforplay.xyz${pathname}${search}${hash}`;
    if (href !== url) {
      // サブドメインだけを www <==> earlybird に切り替える
      window.location.assign(url);
    }
  };

  render() {
    const { classes, user, isSignedIn } = this.props;
    const { anchorEl } = this.state;

    const { hostname } = window.location;
    const isEarlyBird =
      hostname.startsWith('earlybird') || hostname.startsWith('localhost');

    return (
      <div className={classes.root}>
        <AppBar position="fixed" elevation={0}>
          <Toolbar className={classes.toolbar}>
            <Typography
              type="title"
              style={{ color: 'black' }}
              component={Link}
              to="/"
              className={classes.title}
            >
              <img src={logo} height={36} alt="HackforPlay" />
            </Typography>
            <Select
              value={isEarlyBird ? 'earlybird' : 'www'}
              displayEmpty
              disableUnderline
              onChange={this.handleVersionChange}
              className={classes.select}
              classes={{ icon: classes.selectIcon }}
            >
              <MenuItem value="earlybird">最新版</MenuItem>
              <MenuItem value="www">安定版</MenuItem>
            </Select>

            <div className={classes.blank} />
            <Button
              color="contrast"
              component={Link}
              to="/"
              className={classes.separator}
            >
              <Home />
              ホーム
            </Button>
            <Button
              color="contrast"
              component={Link}
              to="/contents/tutorial"
              className={classes.separator}
            >
              <Beginner />
              あそびかた
            </Button>
            <Button
              color="contrast"
              component={Link}
              to="/lists"
              className={classes.separator}
            >
              <Play />
              みんなのステージ
            </Button>
            <Button
              color="contrast"
              component={Link}
              to="/contents/kit"
              className={classes.separator}
            >
              <Create />
              ステージを作る
            </Button>
            {user.data ? <div className={classes.separator} /> : null}
            {user.data ? (
              user.data.photoURL ? (
                // アイコンアバター
                <Avatar
                  aria-owns={anchorEl ? 'simple-menu' : null}
                  aria-haspopup="true"
                  className={classes.avatar}
                  src={user.data.photoURL}
                  storagePath={user.data.profileImagePath}
                  onClick={this.handleClick}
                />
              ) : (
                // 文字アバター
                <Avatar
                  aria-owns={anchorEl ? 'simple-menu' : null}
                  aria-haspopup="true"
                  className={classes.avatar}
                  onClick={this.handleClick}
                >
                  {user.data.displayName.substr(0, 1)}
                </Avatar>
              )
            ) : (
              <Button
                raised
                color="primary"
                aria-owns={anchorEl ? 'simple-menu' : null}
                aria-haspopup="true"
                onClick={this.handleClick}
                disabled={user.isProcessing}
              >
                ログイン
              </Button>
            )}
            <Popover
              id="simple-menu"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              {user.data ? (
                <MenuItem onClick={this.goTo(`/users/${user.data.uid}`)}>
                  <Typography type="button">マイページ</Typography>
                </MenuItem>
              ) : null}
              {isSignedIn ? (
                <MenuItem onClick={this.signOut}>
                  <Typography type="button">ログアウト</Typography>
                </MenuItem>
              ) : (
                <MenuItem onClick={this.signInWithGoogle}>
                  <img src={googleIcon} alt="Google" className={classes.icon} />
                  <Typography type="button">Google でログイン</Typography>
                </MenuItem>
              )}
            </Popover>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Header;
