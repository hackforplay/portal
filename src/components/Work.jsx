// @flow
import * as React from 'react';
import classNames from 'classnames';
import { withRouter, type LocationShape } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Popover from 'material-ui/Popover';
import Chip from 'material-ui/Chip';
import { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import { style } from 'typestyle';
import Menu from 'material-ui-icons/Menu';
import Close from 'material-ui-icons/Close';

import theme from '../settings/theme';
import Feeles from '../containers/Feeles';
import EditableTitleTextField from '../containers/EditableTitleTextField';
import ThumbnailDialog from '../containers/ThumbnailDialog';
import type { StateProps, DispatchProps } from '../containers/Work';
import type { OnMessage } from '../components/Feeles';

export const removeMessage = `削除すると、二度と復元はできません。本当に削除しますか？`;

export type Props = StateProps & DispatchProps & { ...ContextRouter };

export type State = {
  anchorEl: ?HTMLElement,
  open: boolean,
  openSidebar: boolean,
  unblock: () => void
};

const cn = {
  chip: style({
    marginRight: theme.spacing.unit * 2
  }),
  blank: style({
    flex: 1
  }),
  caption: style({
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  }),
  noTitle: style({
    fontStyle: 'italic'
  }),
  title: style({
    ...theme.typography.title,
    maxWidth: 500,
    flexGrow: 1,
    flexShrink: 10000
  }),
  underline: style({
    '&:before': {
      // focus も hover もされていないときの underline を消去
      height: 0
    }
  }),
  iconButton: style({
    marginLeft: 4,
    marginRight: 4
  }),
  error: style({
    color: 'red'
  })
};

@withRouter
export default class Work extends React.Component<Props, State> {
  static defaultProps = {
    replay: false,
    isPreparing: false,
    redirect: ''
  };

  state = {
    anchorEl: null,
    open: false,
    openSidebar: false,
    unblock: () => {}
  };

  componentDidMount() {
    const { location, history } = this.props;
    const unblock = history.block((nextLocation, action) => {
      if (location.pathname === nextLocation.pathname) return false;
      return 'このページを はなれますか？';
    });
    this.setState({ unblock });
  }

  componentDidUpdate(prevProps: Props) {
    const { redirect } = this.props;
    if (prevProps.redirect !== redirect && redirect) {
      this.moveTo(redirect);
    }
  }

  componentWillUnmount() {
    this.state.unblock();
  }

  moveTo(location: LocationShape | string) {
    this.state.unblock();
    this.props.history.push(location);
  }

  handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleDialogOpen = () => {
    this.setState({ open: true, anchorEl: null });
  };

  handleClose = () => {
    const nextState = {};
    if (this.state.anchorEl) {
      nextState.anchorEl = null;
    }
    if (this.state.open) {
      nextState.open = false;
    }
    this.setState(nextState);
  };

  handleSave = () => {
    const { make: { metadata, thumbnails } } = this.props;
    if (!metadata.thumbnailStoragePath && thumbnails.length > 0) {
      // もしサムネイルが設定おらず, サムネイルが撮影されている場合, まずサムネイルを設定させる
      this.setState({
        open: true
      });
      // サムネイルを設定したら自動的にセーブされるので、何もしない
    } else {
      this.props.saveWork();
    }
  };

  handleSetPublic = () => {
    this.props.setWorkVisibility('public');
    this.handleClose();
  };

  handleSetLimited = () => {
    this.props.setWorkVisibility('limited');
    this.handleClose();
  };

  handleSetPrivate = () => {
    this.props.setWorkVisibility('private');
    this.handleClose();
  };

  handleRemove = () => {
    if (window.confirm(removeMessage)) {
      this.props.removeWork();
    }
    this.handleClose();
  };

  handleShareTwitter = () => {
    const text = `ステージを作りました！ ${window.location.href} #hackforplay`;
    const width = 550;
    const height = 420;
    const left = Math.max(Math.round(window.screen.width / 2 - width / 2), 0);
    const top = Math.max(Math.round(window.screen.height / 2 - height / 2), 0);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      'intent',
      `scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=${width},height=${height},left=${left},top=${top}`
    );
  };

  // Feeles で実行している iframe から message を受け取った
  handleMessage: OnMessage = event => {
    const { data: { value: { labelName, labelValue, href } } } = event;
    const { make, work } = this.props;
    if (labelName) {
      // path に対して実行 (その path とは, 改変前なら work.data.path, 改変後なら make.work.data.path)
      const path = make.changed
        ? make.work.data ? make.work.data.path : null
        : work.data ? work.data.path : null;
      if (path) {
        // もし現在プレイ中の work の path が存在するなら labels に新たなラベルを追加
        // e.g. { 'gameclear': 'gameclear' }
        this.props.addWorkViewLabel(path, labelName, labelValue);
      }
    }
    if (href) {
      // origin が同じか検証
      const a = document.createElement('a');
      a.href = href;
      if (a.origin !== window.location.origin) {
        console.error(`Cannot open ${href} because different origin`);
        return;
      }
      // react-router で遷移
      this.moveTo({
        hash: a.hash,
        pathname: a.pathname,
        search: a.search
      });
    }
  };

  render() {
    const {
      work,
      canSave,
      canPublish,
      canRemove,
      replay,
      make,
      isPreparing
    } = this.props;
    const { anchorEl } = this.state;

    if (!work.data) {
      if (work.isProcessing) {
        return <div>ロード中...</div>;
      }
      if (work.isEmpty) {
        return <div>ステージが見つかりませんでした</div>;
      }
      if (work.isInvalid) {
        switch (work.error) {
          case 'not-found':
            return <div>ステージが見つかりません</div>;
          case 'unavailable':
            return <div>サービスが一時的に利用できません</div>;
          case 'permission-denied':
            return <div>権限がありません</div>;
          default:
            return <div>エラー</div>;
        }
      }
      return null;
    }

    const title = work.data.title;
    const src = work.data.asset_url || '';
    const storagePath = work.data.assetStoragePath || '';
    const makeWorkData = make.work.data;
    const hasError = make.error !== null;

    // portal 側でプロジェクトの中身を取得できるまで render しない
    // (onChange によって Store が書き換えられると saved: false になるため)
    if (isPreparing) {
      return <div>「{title}」を準備中...</div>;
    }

    return (
      <div>
        {replay ? (
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar disableGutters>
              <IconButton
                onClick={() => {
                  this.setState({ openSidebar: !this.state.openSidebar });
                }}
                className={cn.iconButton}
              >
                {this.state.openSidebar ? <Close /> : <Menu />}
              </IconButton>
              {makeWorkData ? (
                <Chip
                  label={
                    {
                      public: '公開中',
                      limited: '限定公開',
                      private: '非公開'
                    }[makeWorkData.visibility]
                  }
                  className={cn.chip}
                />
              ) : null}
              {replay ? (
                <EditableTitleTextField
                  placeholder="タイトルがついていません"
                  className={classNames(cn.title, {
                    [cn.noTitle]: !make.metadata.title
                  })}
                  InputProps={{
                    cn: {
                      underline: cn.underline
                    }
                  }}
                />
              ) : (
                <Typography variant="title">{title}</Typography>
              )}
              <div className={cn.blank} />
              {hasError ? (
                <span className={cn.error}>エラーがおきたようです</span>
              ) : null}
              {makeWorkData && makeWorkData.visibility !== 'public' ? (
                <Button disabled={!canPublish} onClick={this.handleSetPublic}>
                  {`公開する`}
                </Button>
              ) : null}
              {make.work.isProcessing || make.saved ? (
                <Typography variant="caption" className={cn.caption}>
                  {make.saved ? `保存されています` : `ちょっとまってね...`}
                </Typography>
              ) : (
                <Button disabled={!canSave} onClick={this.handleSave}>
                  保存する
                </Button>
              )}
              <Button
                aria-owns={anchorEl ? 'simple-menu' : null}
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                その他
              </Button>
              <Popover
                id="simple-menu"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
              >
                <MenuItem
                  disabled={make.thumbnails.length === 0}
                  onClick={this.handleDialogOpen}
                >
                  カバー画像をセットする
                </MenuItem>
                {makeWorkData && makeWorkData.visibility === 'public' ? (
                  <MenuItem onClick={this.handleShareTwitter}>
                    Twitter でシェア
                  </MenuItem>
                ) : null}
                {makeWorkData && makeWorkData.visibility !== 'private' ? (
                  <MenuItem
                    disabled={!canPublish}
                    onClick={this.handleSetPrivate}
                  >
                    非公開にする
                  </MenuItem>
                ) : null}
                {makeWorkData && makeWorkData.visibility !== 'limited' ? (
                  <MenuItem
                    disabled={!canPublish}
                    onClick={this.handleSetLimited}
                  >
                    限定公開にする
                  </MenuItem>
                ) : null}
                {makeWorkData ? (
                  <MenuItem disabled={!canRemove} onClick={this.handleRemove}>
                    削除する
                  </MenuItem>
                ) : null}
              </Popover>
            </Toolbar>
          </AppBar>
        ) : null}
        <Feeles
          src={src}
          storagePath={storagePath}
          replay={replay}
          onMessage={this.handleMessage}
          openSidebar={this.state.openSidebar}
        />
        <ThumbnailDialog open={this.state.open} onClose={this.handleClose} />
      </div>
    );
  }
}
