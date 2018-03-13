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
import grey from 'material-ui/colors/grey';

import Avatar from '../containers/Avatar';
import theme from '../settings/theme';
import googleIcon from '../resources/google.svg';
import logo from '../resources/logo.png';
import type { UserType } from '../ducks/user';

type Props = {
  classes: {
    root: string,
    toolbar: string,
    blank: string,
    icon: string,
    avatar: string,
    title: string
  },
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
    backgroundColor: grey[900]
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
    filter: 'invert()'
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

  render() {
    const { classes, user } = this.props;
    const { anchorEl } = this.state;
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
            <div className={classes.blank} />
            <Button color="contrast" component={Link} to="/">
              ホーム
            </Button>
            <Button color="contrast" component={Link} to="/contents/tutorial">
              あそびかた
            </Button>
            <Button color="contrast" component={Link} to="/lists">
              みんなの作品
            </Button>
            <Button color="contrast" component={Link} to="/contents/kit">
              ゲームを作る
            </Button>
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
              {user.data || user.isProcessing ? (
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
