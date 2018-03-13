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

type Props = {
  changeWork: changeWorkType,
  classes: {
    blank: string,
    root: string
  },
  work: WorkItemType,
  replayable: boolean,
  creating: CreatingType
} & ContextRouter;

type State = {
  anchorEl: ?HTMLElement,
  rootEl: ?HTMLElement,
  loading: boolean
};

// <script async defer src="/h4p.js"></script> が挿入するグローバル変数を受け取る
const h4pPromise = new Promise((resolve, reject) => {
  const timer = setInterval(() => {
    if (window.h4p) {
      clearInterval(timer);
      resolve(window.h4p);
    }
  }, 100);
});

const replayableClassName = 'replayable';

const rootStyle = (padding: number) => ({
  [`&.${replayableClassName}`]: {
    height: `calc(100vh - ${padding * 2}px)`
  },
  height: `calc(100vh - ${padding}px)`
});

@withStyles({
  blank: {
    flex: 1
  },
  root: rootStyle(56),
  '@media (min-width:0px) and (orientation: landscape)': {
    root: rootStyle(48)
  },
  '@media (min-width:600px)': {
    root: rootStyle(64)
  }
})
class Work extends React.Component<Props, State> {
  static defaultProps = {
    replayable: false
  };

  state = {
    anchorEl: null,
    rootEl: null,
    loading: true
  };

  componentDidMount() {
    this.handleLoad();
  }

  componentDidUpdate() {
    this.handleLoad();
  }

  componentWillUnmount() {
    h4pPromise.then(h4p => {
      if (this.state.rootEl) {
        h4p.unmount(this.state.rootEl);
      }
    });
  }

  handleLoad() {
    const { work } = this.props;
    if (!work.data) return;
    const { asset_url } = work.data;
    if (this.state.loading && this.state.rootEl && asset_url) {
      h4pPromise.then(h4p => {
        this.setState({ loading: false }, () => {
          h4p({
            rootElement: this.state.rootEl,
            jsonURL: asset_url,
            onChange: this.props.changeWork
          });
        });
      });
    }
  }

  handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, work, replayable, creating } = this.props;
    const { anchorEl } = this.state;

    const root = classNames(classes.root, {
      [replayableClassName]: replayable
    });

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
        <div
          className={root}
          ref={rootEl => this.state.rootEl || this.setState({ rootEl })}
        />
      </div>
    );
  }
}

export default Work;
