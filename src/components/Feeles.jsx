import * as React from 'react';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

import type { changeWorkType } from '../ducks/work';

type Props = {
  changeWork: changeWorkType,
  src: string,
  alt: string,
  replay: boolean,
  replayable: boolean,
  classes: {
    root: string
  }
};

type State = {
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

const replayClassName = 'replay';
const rootStyle = (padding: number) => ({
  [`&.${replayClassName}`]: {
    height: `calc(100vh - ${padding * 2}px)`
  },
  height: `calc(100vh - ${padding}px)`
});

@withStyles({
  root: rootStyle(56),
  '@media (min-width:0px) and (orientation: landscape)': {
    root: rootStyle(48)
  },
  '@media (min-width:600px)': {
    root: rootStyle(64)
  }
})
export default class Feeles extends React.Component<Props, State> {
  state = {
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
    const { src, replay } = this.props;
    if (this.state.loading && this.state.rootEl && src) {
      h4pPromise.then(h4p => {
        this.setState({ loading: false }, () => {
          h4p({
            rootElement: this.state.rootEl,
            jsonURL: src,
            onChange: this.props.changeWork,
            disableLocalSave: replay // デフォルトのメニューを出さない
          });
        });
      });
    }
  }

  render() {
    const { classes, replay, replayable } = this.props;

    const root = classNames(classes.root, {
      [replayClassName]: replay || replayable
    });

    return (
      <div
        className={root}
        ref={rootEl => this.state.rootEl || this.setState({ rootEl })}
      />
    );
  }
}
