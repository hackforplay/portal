// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Input from 'material-ui/Input/Input';
import Photo from 'material-ui-icons/Photo';

import theme from '../settings/theme';
import type { UserType, EditingUserData } from '../ducks/user';

type Props = {
  classes: {
    root: string,
    container: string,
    avatar: string,
    button: string,
    iconButton: string,
    textFieldRoot: string,
    textFieldInput: string
  },
  edit: boolean | void,
  user: UserType,
  editing?: EditingUserData,
  editAuthUser?: (editing: EditingUserData) => void,
  cancelAuthUserEditing?: () => {},
  confirmAuthUserEditing?: () => {}
};

@withStyles({
  root: {
    paddingTop: theme.spacing.unit * 8,
    paddingLeft: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    backgroundColor: theme.palette.background.appBar
  },
  container: {
    maxWidth: 600
  },
  avatar: {
    width: '100%',
    height: '100%',
    fontSize: '2.5rem'
  },
  avatarEdit: {
    position: 'absolute',
    zIndex: 1,
    opacity: 0.7,
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.primary[500],
    '&:hover': {
      cursor: 'pointer',
      opacity: 1
    }
  },
  button: {
    marginBottom: theme.spacing.unit
  },
  iconButton: {
    marginTop: -48
  },
  textFieldRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3
    }
  },
  textFieldInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    width: 'calc(100% - 24px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  }
})
export default class Profile extends React.Component<Props> {
  static defaultProps = {
    edit: false
  };

  editDisplayName = (displayName: string) => {
    if (this.props.editAuthUser) {
      this.props.editAuthUser({ displayName });
    }
  };

  render() {
    const { classes, user, edit, editing } = this.props;

    if (user.isEmpty) {
      return (
        <div className={classes.root}>
          <Typography type="headline">ユーザーが見つかりません</Typography>
        </div>
      );
    }

    if (!user.isAvailable) {
      return (
        <div className={classes.root}>
          <Typography type="headline">ロード中です</Typography>
        </div>
      );
    }

    const userData = editing
      ? {
          ...user.data,
          ...editing
        }
      : user.data;

    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={16}
          alignItems="center"
          className={classes.container}
        >
          <Grid item xs={2}>
            <Avatar
              className={classes.avatar}
              src={userData.photoURL}
              alt={userData.displayName.substr(0, 1)}
            />
            {edit ? (
              <IconButton
                color="primary"
                className={classes.iconButton}
                aria-label="Edit profile image"
              >
                <Photo />
              </IconButton>
            ) : null}
          </Grid>
          <Grid item xs={5}>
            {edit ? (
              <Input
                id="name"
                disableUnderline
                classes={{
                  root: classes.textFieldRoot,
                  input: classes.textFieldInput
                }}
                autoFocus
                value={userData.displayName}
                onChange={event => this.editDisplayName(event.target.value)}
              />
            ) : (
              <Typography type="headline">{userData.displayName}</Typography>
            )}
            <Typography type="caption" align="left">{`投稿数 ${
              userData.worksNum
            }`}</Typography>
          </Grid>
          <Grid item xs={5}>
            {edit ? (
              <Button
                raised
                color="primary"
                className={classes.button}
                component={Link}
                to={`/users/${userData.uid}`}
                onClick={this.props.confirmAuthUserEditing}
              >
                変更を保存する
              </Button>
            ) : (
              <Button
                raised
                color="primary"
                className={classes.button}
                component={Link}
                to={`/users/${userData.uid}/edit`}
              >
                プロフィールを編集する
              </Button>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}
