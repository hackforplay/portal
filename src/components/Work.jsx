// @flow
import * as React from 'react';
import type { ContextRouter } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Popover from 'material-ui/Popover';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';

import Feeles from '../containers/Feeles';
import type { WorkItemType } from '../ducks/work';
import type { saveWorkType, State as MakeState } from '../ducks/make';

type Props = {
  saveWork: saveWorkType,
  classes: {
    blank: string
  },
  work: WorkItemType,
  replay: boolean,
  replayable: boolean, // TODO: 旧保存を残すための Props. いずれ replay に統合する
  make: MakeState
} & ContextRouter;

type State = {
  anchorEl: ?HTMLElement
};

@withStyles({
  blank: {
    flex: 1
  }
})
class Work extends React.Component<Props, State> {
  static defaultProps = {
    replay: false,
    replayable: false
  };

  state = {
    anchorEl: null
  };

  handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSave = () => {
    this.props.saveWork({
      title: 'たいとるのてすと',
      description: 'せつめいのてすと',
      author: 'なまえのてすと'
    });
  };

  render() {
    const { classes, work, replay, replayable, make } = this.props;
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

    const alt = work.data.title;
    const src = work.data.asset_url || '';
    const storagePath = work.data.assetStoragePath || '';
    const canSave = !make.saved && (make.work.isEmpty || make.work.isAvailable);

    return (
      <div>
        {replay || replayable ? (
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar>
              <Typography type="headline">
                {work.data ? work.data.title : '読み込み中...'}
              </Typography>
              <div className={classes.blank} />
              {make.work.isProcessing || make.saved ? (
                <Typography type="caption">
                  {make.saved ? `保存されています` : `保存中...`}
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
                <MenuItem onClick={this.handleClose} />
              </Popover>
            </Toolbar>
          </AppBar>
        ) : null}
        <Feeles
          src={src}
          alt={alt}
          storagePath={storagePath}
          replay={replay}
          replayable={replayable}
        />
      </div>
    );
  }
}

export default Work;
