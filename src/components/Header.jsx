// @flow
import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button/Button';
import Select from '@material-ui/core/Select';
import grey from '@material-ui/core/colors/grey';
import Home from '@material-ui/icons/Home';
import Tooltip from '@material-ui/core/Tooltip';
import { style, media } from 'typestyle';
import VideogameAsset from '@material-ui/icons/VideogameAsset';
import People from '@material-ui/icons/People';
import Person from '@material-ui/icons/Person';

import Avatar from '../containers/Avatar';
import { withTheme } from '@material-ui/core/styles';
import googleIcon from '../resources/google.svg';
import logo from '../resources/logo.png';
import Beginner from '../icons/Beginner';
import type { StateProps, DispatchProps } from '../containers/Header';
import ContrastButton from './ContrastButton';
import isEarlybird from '../utils/isEarlybird';

const cn = {
  root: style(
    { height: 56 },
    media({ maxWidth: 0, orientation: 'landscape' }, { height: 48 }),
    media({ minWidth: 600 }, { height: 64 })
  ),
  toolbar: style({
    backgroundColor: grey[900],
    maxHeight: 64
  }),
  blank: style({
    flex: 1
  }),
  icon: style({
    width: 18,
    marginRight: 12
  }),
  title: style(
    { color: 'black', filter: 'invert(100%)' },
    // 画面幅が一定以下の時はロゴを表示しない
    media({ maxWidth: 721 }, { display: 'none' })
  ),
  separator: style(
    {
      position: 'relative',
      display: 'inline-flex',
      minHeight: 36,
      alignSelf: 'center',
      $nest: {}
    },
    media(
      { minWidth: 920 },
      {
        $nest: {
          '&::before': {
            // button label が表示されるときだけ separator を表示する
            content: '""',
            position: 'absolute',
            left: 0,
            backgroundColor: 'white',
            width: 1,
            height: 36
          }
        }
      }
    )
  ),
  select: style(
    {
      marginLeft: 8,
      marginRight: 8,
      color: 'white'
    },
    // 画面幅が一定以下の時は切り替えメニューを表示しない
    media({ maxWidth: 561 }, { display: 'none' })
  ),
  selectIcon: style({
    color: 'white'
  }),
  // button label が表示されるときは tooltip を表示しない
  tooltip: style(media({ minWidth: 920 }, { display: 'none' })),
  // 画面幅が一定以上の時だけ button label を表示する
  buttonLabel: style(media({ maxWidth: 921 }, { display: 'none' }))
};
const getCn = props => ({
  avatar: style({
    cursor: 'pointer',
    marginLeft: props.theme.spacing.unit,
    marginRight: props.theme.spacing.unit
  })
});

export type OwnProps = {};
export type Props = OwnProps &
  StateProps &
  DispatchProps & { ...ContextRouter };

type State = {
  anchorEl: ?HTMLElement
};

@withTheme()
@withRouter
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

  handleVersionChange = (event: { target: { value: string } }) => {
    const subDomain = event.target.value;
    const { pathname, search, hash, href } = window.location;
    const url = `https://${subDomain}.hackforplay.xyz${pathname}${search}${hash}`;
    if (href !== url) {
      // サブドメインだけを www <==> earlybird に切り替える
      window.location.assign(url);
    }
  };

  render() {
    const dcn = getCn(this.props);
    const { auth, user, isSignedIn, isInOfficialWork } = this.props;
    const { anchorEl } = this.state;

    return (
      <div className={cn.root}>
        <AppBar position="fixed" elevation={0}>
          <Toolbar className={cn.toolbar}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              className={cn.title}
            >
              <img src={logo} height={36} alt="HackforPlay" />
            </Typography>
            <Select
              value={isEarlybird ? 'earlybird' : 'www'}
              displayEmpty
              disableUnderline
              onChange={this.handleVersionChange}
              className={cn.select}
              classes={{ icon: cn.selectIcon }}
            >
              <MenuItem value="earlybird">最新版</MenuItem>
              <MenuItem value="www">安定版</MenuItem>
            </Select>

            <div className={cn.blank} />
            <Tooltip title="ホーム" classes={{ tooltip: cn.tooltip }}>
              <ContrastButton component={Link} to="/" className={cn.separator}>
                <Home />
                <span className={cn.buttonLabel}>ホーム</span>
              </ContrastButton>
            </Tooltip>
            {isInOfficialWork ? null : (
              <Tooltip title="あそびかた" classes={{ tooltip: cn.tooltip }}>
                <ContrastButton
                  component={Link}
                  to="/contents/tutorial"
                  className={cn.separator}
                >
                  <Beginner />
                  <span className={cn.buttonLabel}>あそびかた</span>
                </ContrastButton>
              </Tooltip>
            )}
            <Tooltip title="ステージをつくる" classes={{ tooltip: cn.tooltip }}>
              <ContrastButton
                component={Link}
                to="/contents/kit"
                className={cn.separator}
              >
                <VideogameAsset />
                <span className={cn.buttonLabel}>ステージをつくる</span>
              </ContrastButton>
            </Tooltip>
            <Tooltip title="みんなのステージ" classes={{ tooltip: cn.tooltip }}>
              <ContrastButton
                component={Link}
                to="/lists"
                className={cn.separator}
              >
                <People />
                <span className={cn.buttonLabel}>みんなのステージ</span>
              </ContrastButton>
            </Tooltip>
            {user.data ? <div className={cn.separator} /> : null}
            {user.data ? (
              user.data.photoURL ? (
                // アイコンアバター
                <Avatar
                  aria-owns={anchorEl ? 'simple-menu' : null}
                  aria-haspopup="true"
                  className={dcn.avatar}
                  src={user.data.photoURL}
                  storagePath={user.data.profileImagePath}
                  onClick={this.handleClick}
                />
              ) : (
                // 文字アバター
                <Avatar
                  aria-owns={anchorEl ? 'simple-menu' : null}
                  aria-haspopup="true"
                  className={cn.avatar}
                  onClick={this.handleClick}
                >
                  {user.data.displayName.substr(0, 1)}
                </Avatar>
              )
            ) : (
              <Button
                variant="contained"
                color="primary"
                aria-owns={anchorEl ? 'simple-menu' : null}
                aria-haspopup="true"
                onClick={this.handleClick}
                disabled={user.isProcessing || !auth.initialized}
              >
                <Person />
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
                  マイページ
                </MenuItem>
              ) : null}
              {isSignedIn ? (
                <MenuItem onClick={this.signOut}>ログアウト</MenuItem>
              ) : (
                <MenuItem onClick={this.signInWithGoogle}>
                  <img src={googleIcon} alt="Google" className={cn.icon} />
                  Google でログイン
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
