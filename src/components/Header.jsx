// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { MenuItem } from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import Button from 'material-ui/Button/Button';
import grey from 'material-ui/colors/grey';

import theme from '../settings/theme';
import googleIcon from '../resources/google.svg';
import type { UserType } from '../ducks/user';

type Props = {
  classes: {
    toolbar: string,
    blank: string,
    icon: string,
    avatar: string
  },
  user: UserType,
  signInWithGoogle: () => {},
  signOut: () => {}
};

type State = {
  anchorEl: ?HTMLElement
};

@withStyles({
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

  render() {
    const { classes, user } = this.props;
    const { anchorEl } = this.state;
    return (
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography type="title" color="inherit" component={Link} to="/">
            HackforPlay
          </Typography>
          <div className={classes.blank} />
          <Button color="contrast" component={Link} to="/contents/tutorial">
            チュートリアル
          </Button>
          <Button color="contrast" component={Link} to="/lists">
            ゲームプレイ
          </Button>
          <Button color="contrast" component={Link} to="/contents/kit">
            クリエイト
          </Button>
          {user.isAvailable ? (
            user.data.photoURL ? (
              // アイコンアバター
              <Avatar
                aria-owns={anchorEl ? 'simple-menu' : null}
                aria-haspopup="true"
                className={classes.avatar}
                src={user.data.photoURL}
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
            {user.isAvailable ? (
              <MenuItem onClick={this.handleClose}>
                <Typography
                  type="button"
                  component={Link}
                  to={`/users/${user.data.uid}`}
                >
                  マイページ
                </Typography>
              </MenuItem>
            ) : null}
            {user.isAvailable || user.isProcessing ? (
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
    );
  }
}

export default Header;
