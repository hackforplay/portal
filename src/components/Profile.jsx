// @flow
import * as React from 'react';
import md5 from 'md5';
import mime from 'mime-types';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Input from 'material-ui/Input/Input';
import Photo from 'material-ui-icons/Photo';

import Avatar from '../containers/Avatar';
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
    textFieldInput: string,
    fileInput: string
  },
  owner: boolean,
  edit: boolean | void,
  user: UserType,
  editing?: EditingUserData,
  editAuthUser: (editing: EditingUserData) => void,
  cancelAuthUserEditing: () => {},
  confirmAuthUserEditing: () => {},
  uploadBlob: (path: string, file: Blob) => void
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
    width: 80,
    height: 80,
    fontSize: '2.5rem'
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
  },
  fileInput: {
    display: 'none'
  }
})
export default class Profile extends React.Component<Props> {
  static defaultProps = {
    edit: false,
    editAuthUser: () => {},
    cancelAuthUserEditing: () => {},
    confirmAuthUserEditing: () => {},
    uploadBlob: () => {}
  };

  input: ?HTMLInputElement = null;

  handleClickPhotoIcon = () => {
    const { user } = this.props;

    if (this.input && user.data) {
      const { uid } = user.data;
      this.input.onchange = (event: SyntheticInputEvent<HTMLInputElement>) => {
        const [file] = event.target.files;
        if (!file) return;
        // 拡張子を取得
        const ext = mime.extension(file.type);
        if (!ext) return;

        // バイナリの MD5 ハッシュを計算するために ArrayBuffer でロード
        const fileReader = new FileReader();
        fileReader.onload = event => {
          const { result } = fileReader;
          if (typeof result === 'string') {
            const mes = `readAsArrayBuffer expects type of ArrayBuffer but String given: ${result}`;
            throw new TypeError(mes);
          }
          // md5 がアクセスできるよう TypedArray のビューを作成
          const len = (result.byteLength / 4) >> 0; // bytes => 32bit Array
          const buffer = new Int32Array(result, 0, len);
          // ハッシュを計算
          const hash = md5(buffer);

          // 格納場所
          const path = `images/public/users/${uid}/${hash}.${ext}`;
          // アップロード！
          this.props.uploadBlob(path, file);
          // パスを設定
          this.props.editAuthUser({ profileImagePath: path });
        };
        fileReader.readAsArrayBuffer(file);
      };

      this.input.click();
    }
  };

  render() {
    const { classes, user, edit, editing, owner } = this.props;

    if (user.isEmpty) {
      return (
        <div className={classes.root}>
          <Typography type="headline">ユーザーが見つかりません</Typography>
        </div>
      );
    }

    if (!user.data) {
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
              storagePath={userData.profileImagePath}
              alt={userData.displayName.substr(0, 1)}
            />
            {edit ? (
              <div>
                <IconButton
                  color="primary"
                  className={classes.iconButton}
                  aria-label="Edit profile image"
                  onClick={this.handleClickPhotoIcon}
                >
                  <Photo />
                </IconButton>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  className={classes.fileInput}
                  ref={input => (this.input = input)}
                />
              </div>
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
                onChange={event =>
                  this.props.editAuthUser({ displayName: event.target.value })
                }
              />
            ) : (
              <Typography type="headline">{userData.displayName}</Typography>
            )}
            {userData.worksNum ? (
              <Typography type="caption" align="left">{`投稿数 ${
                userData.worksNum
              }`}</Typography>
            ) : null}
          </Grid>
          {owner ? (
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
          ) : null}
        </Grid>
      </div>
    );
  }
}
