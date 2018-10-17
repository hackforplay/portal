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
import { style } from 'typestyle';

import Avatar from '../containers/Avatar';
import { withTheme } from '@material-ui/core/styles';
import type { StateProps, DispatchProps } from '../containers/ProfileEdit';

const cn = {
  container: style({
    maxWidth: 600
  }),
  avatar: style({
    width: 80,
    height: 80,
    fontSize: '2.5rem'
  }),
  iconButton: style({
    marginTop: -48
  }),
  fileInput: style({
    display: 'none'
  })
};
const getCn = props => ({
  root: style({
    paddingTop: props.theme.spacing.unit * 8,
    paddingLeft: props.theme.spacing.unit * 4,
    paddingBottom: props.theme.spacing.unit * 4,
    backgroundColor: props.theme.palette.background.appBar
  }),
  textFieldInput: style({
    borderRadius: 4,
    backgroundColor: props.theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    width: 'calc(100% - 24px)',
    transition: props.theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  }),
  textFieldRoot: style({
    padding: 0,
    'label + &': {
      marginTop: props.theme.spacing.unit * 3
    }
  }),
  button: style({
    marginBottom: props.theme.spacing.unit
  })
});

export type OwnProps = {
  edit?: boolean
};

export type Props = OwnProps &
  StateProps &
  DispatchProps & { ...ContextRouter };

@withTheme()
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
    const dcn = getCn(this.props);
    const { user, edit, editing, owner } = this.props;

    if (user.isEmpty) {
      return (
        <div className={dcn.root}>
          <Typography variant="headline">ユーザーが見つかりません</Typography>
        </div>
      );
    }

    if (!user.data) {
      return (
        <div className={dcn.root}>
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
      <div className={dcn.root}>
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
                  classes: {
                    root: dcn.textFieldRoot,
                    input: dcn.textFieldInput
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
                  className={dcn.button}
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
                  className={dcn.button}
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
