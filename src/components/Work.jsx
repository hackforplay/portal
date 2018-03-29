// @flow
import * as React from 'react';
import classNames from 'classnames';
import type { ContextRouter } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Popover from 'material-ui/Popover';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';

import theme from '../settings/theme';
import Feeles from '../containers/Feeles';
import EditableTitleTextField from '../containers/EditableTitleTextField';
import type { WorkItemType } from '../ducks/work';
import type {
  saveWorkType,
  setWorkVisibilityType,
  setMetadataType,
  removeWorkType,
  State as MakeState
} from '../ducks/make';

type Props = {
  saveWork: saveWorkType,
  setWorkVisibility: setWorkVisibilityType,
  setMetadata: setMetadataType,
  removeWork: removeWorkType,
  classes: {
    blank: string,
    caption: string,
    noTitle: string,
    title: string,
    underline: string
  },
  work: WorkItemType,
  replay: boolean,
  canSave: boolean,
  canPublish: boolean,
  canRemove: boolean,
  make: MakeState
} & ContextRouter;

type State = {
  anchorEl: ?HTMLElement
};

@withStyles({
  blank: {
    flex: 1
  },
  caption: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  },
  noTitle: {
    fontStyle: 'italic'
  },
  title: {
    ...theme.typography.title,
    maxWidth: 500,
    flexGrow: 1,
    flexShrink: 10000
  },
  underline: {
    '&:before': {
      // focus も hover もされていないときの underline を消去
      height: 0
    }
  }
})
class Work extends React.Component<Props, State> {
  static defaultProps = {
    replay: false
  };

  state = {
    anchorEl: null
  };

  handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    if (this.state.anchorEl) {
      this.setState({ anchorEl: null });
    }
  };

  handleSetPublic = () => {
    this.props.setWorkVisibility('public');
    this.handleClose();
  };

  handleSetPrivate = () => {
    this.props.setWorkVisibility('private');
    this.handleClose();
  };

  handleRemove = () => {
    const message = `削除すると、二度と復元はできません。本当に削除しますか？`;
    if (window.confirm(message)) {
      this.props.removeWork();
      this.handleClose();
    }
  };

  render() {
    const {
      classes,
      work,
      canSave,
      canPublish,
      canRemove,
      replay,
      make
    } = this.props;
    const { anchorEl } = this.state;

    if (!work.data) {
      if (work.isProcessing) {
        return <div>ロード中...</div>;
      }
      if (work.isEmpty) {
        return <div>作品が見つかりませんでした</div>;
      }
      if (work.isInvalid) {
        return <div>権限がありません</div>;
      }
      return null;
    }

    const title = work.data.title;
    const src = work.data.asset_url || '';
    const storagePath = work.data.assetStoragePath || '';
    const makeWorkData = make.work.data;

    return (
      <div>
        {replay ? (
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar>
              {replay ? (
                <EditableTitleTextField
                  placeholder="タイトルがついていません"
                  className={classNames(classes.title, {
                    [classes.noTitle]: !make.metadata.title
                  })}
                  InputProps={{
                    classes: {
                      underline: classes.underline
                    }
                  }}
                />
              ) : (
                <Typography type="title">{title}</Typography>
              )}
              <div className={classes.blank} />
              {makeWorkData ? (
                makeWorkData.visibility === 'public' ? (
                  <Typography
                    type="caption"
                    className={classes.caption}
                  >{`公開中`}</Typography>
                ) : (
                  <Button disabled={!canPublish} onClick={this.handleSetPublic}>
                    {`公開する`}
                  </Button>
                )
              ) : null}
              {make.work.isProcessing || make.saved ? (
                <Typography type="caption" className={classes.caption}>
                  {make.saved ? `保存されています` : `ちょっとまってね...`}
                </Typography>
              ) : (
                <Button disabled={!canSave} onClick={this.props.saveWork}>
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
                {makeWorkData && makeWorkData.visibility !== 'private' ? (
                  <MenuItem
                    disabled={!canPublish}
                    onClick={this.handleSetPrivate}
                  >
                    非公開にする
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
        <Feeles src={src} storagePath={storagePath} replay={replay} />
      </div>
    );
  }
}

export default Work;
