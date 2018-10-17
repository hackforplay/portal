// @flow
import * as React from 'react';
import md5 from 'md5';
import mime from 'mime-types';
import { Link, type ContextRouter } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Photo from 'material-ui-icons/Photo';
import { css } from 'emotion';

import Avatar from '../containers/Avatar';
import theme from '../settings/theme';
import type { StateProps, DispatchProps } from '../containers/ProfileEdit';

const cn = {
  root: css({
    paddingTop: theme.spacing.unit * 8,
    paddingLeft: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    backgroundColor: theme.palette.background.appBar
  }),
  container: css({
    maxWidth: 600
  }),
  avatar: css({
    width: 80,
    height: 80,
    fontSize: '2.5rem'
  }),
  button: css({
    marginBottom: theme.spacing.unit
  }),
  iconButton: css({
    marginTop: -48
  }),
  textFieldRoot: css({
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3
    }
  }),
  textFieldInput: css({
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
  }),
  fileInput: css({
    display: 'none'
  })
};

export type OwnProps = {
  edit?: boolean
};

export type Props = OwnProps &
  StateProps &
  DispatchProps & { ...ContextRouter };

export default class Profile extends React.Component<Props> {
  static defaultProps = {
    edit: false
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
          const path = `image/public/users/${uid}/${hash}.${ext}`;
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
    const { user, edit, editing, owner } = this.props;

    if (user.isEmpty) {
      return (
        <div className={cn.root}>
          <Typography variant="headline">ユーザーが見つかりません</Typography>
        </div>
      );
    }

    if (!user.data) {
      return (
        <div className={cn.root}>
          <Typography variant="headline">ロード中です</Typography>
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
      <div className={cn.root}>
        <Grid
          container
          spacing={16}
          alignItems="center"
          className={cn.container}
        >
          <Grid item xs={2}>
            <Avatar
              className={cn.avatar}
              src={userData.photoURL}
              storagePath={userData.profileImagePath}
              alt={userData.displayName.substr(0, 1)}
            />
            {edit ? (
              <div>
                <IconButton
                  color="primary"
                  className={cn.iconButton}
                  aria-label="Edit profile image"
                  onClick={this.handleClickPhotoIcon}
                >
                  <Photo />
                </IconButton>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  className={cn.fileInput}
                  ref={input => (this.input = input)}
                />
              </div>
            ) : null}
          </Grid>
          <Grid item xs={5}>
            {edit ? (
              <TextField
                id="name"
                InputProps={{
                  disableUnderline: true,
                  cn: {
                    root: cn.textFieldRoot,
                    input: cn.textFieldInput
                  }
                }}
                autoFocus
                value={userData.displayName}
                onChange={event =>
                  this.props.editAuthUser({ displayName: event.target.value })
                }
                helperText="本名(ほんみょう)は かかないで！"
              />
            ) : (
              <Typography variant="headline">{userData.displayName}</Typography>
            )}
            {userData.worksNum ? (
              <Typography variant="caption" align="left">{`投稿数 ${
                userData.worksNum
              }`}</Typography>
            ) : null}
          </Grid>
          {owner ? (
            <Grid item xs={5}>
              {edit ? (
                <Button
                  variant="raised"
                  color="primary"
                  className={cn.button}
                  component={Link}
                  to={`/users/${userData.uid}`}
                  onClick={this.props.confirmAuthUserEditing}
                >
                  変更を保存する
                </Button>
              ) : (
                <Button
                  variant="raised"
                  color="primary"
                  className={cn.button}
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
