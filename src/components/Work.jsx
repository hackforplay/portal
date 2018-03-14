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

import type { WorkItemType, changeWorkType, CreatingType } from '../ducks/work';
import Feeles from '../containers/Feeles';

type Props = {
  changeWork: changeWorkType,
  classes: {
    blank: string
  },
  work: WorkItemType,
  replayable: boolean,
  creating: CreatingType
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

  render() {
    const { classes, work, replayable, creating } = this.props;
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

    return (
      <div>
        {replayable ? (
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar>
              <Typography type="headline">
                {work.data ? work.data.title : '読み込み中...'}
              </Typography>
              <div className={classes.blank} />
              <Button disabled={!creating.exists}>保存する</Button>
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
          replayable={replayable}
        />
      </div>
    );
  }
}

export default Work;
