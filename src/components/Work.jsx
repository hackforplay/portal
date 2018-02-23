// @flow
import * as React from 'react';
import type { ContextRouter } from 'react-router-dom';
// import AppBar from 'material-ui/AppBar';
// import Toolbar from 'material-ui/Toolbar';
// import Typography from 'material-ui/Typography';
// import Button from 'material-ui/Button';
// import Popover from 'material-ui/Popover';
// import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';

import type { WorkItemType } from '../ducks/work';

type Props = {
  classes: {
    blank: string,
    root: string
  },
  work: WorkItemType
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

@withStyles({
  blank: {
    flex: 1
  },
  root: {
    '@media (min-width:0px) and (orientation: landscape)': {
      height: `calc(100vh - ${48}px)`
    },
    '@media (min-width:600px)': {
      height: `calc(100vh - ${64}px)`
    },
    height: `calc(100vh - ${56}px)`
  }
})
class Work extends React.Component<Props, State> {
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
    if (this.state.loading && this.state.rootEl && work.isAvailable) {
      h4pPromise.then(h4p => {
        this.setState({ loading: false }, () => {
          h4p({
            rootElement: this.state.rootEl,
            jsonURL: work.data.asset_url,
            onChange: value => {}
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
    const { classes, work } = this.props;
    // const { anchorEl } = this.state;

    if (!work.isAvailable) {
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
        {/* <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography type="headline">
              {work.isAvailable ? work.data.title : '読み込み中...'}
            </Typography>
            <div className={classes.blank} />
            <Button
              disabled={!work.isAvailable}
              target="_blank"
              href={
                work.isAvailable
                  ? `https://www.feeles.com/p/${work.data.search}`
                  : ''
              }
            >
              改造する
            </Button>
            {<Button 
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
              <MenuItem onClick={this.handleClose}>なにかする</MenuItem>
            </Popover>}
          </Toolbar>
        </AppBar> */}
        <div
          className={classes.root}
          ref={rootEl => this.state.rootEl || this.setState({ rootEl })}
        />
      </div>
    );
  }
}

export default Work;
