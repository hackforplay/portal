import * as React from 'react';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

import type { changeWorkType, thumbnailType } from '../ducks/make';

type Props = {
  changeWork: changeWorkType,
  thumbnail: thumbnailType,
  src: string,
  alt: string,
  replay: boolean,
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
          const props = {
            rootElement: this.state.rootEl,
            jsonURL: src
          };
          // TODO: Feeles の機能をなくして portal の機能に一元化する
          // Feeles の機能と portal の機能が両立している場合があるので,
          // replay === false でも onChange は捉える
          props.onChange = this.props.changeWork;
          if (replay) {
            props.onThumbnailChange = this.props.thumbnail;
            props.disableLocalSave = true; // デフォルトのメニューを出さない
            props.disableScreenShotCard = true; // スクリーンショットカードを無効化
          }
          h4p(props);
        });
      });
    }
  }

  render() {
    const { classes, replay } = this.props;

    const root = classNames(classes.root, {
      [replayClassName]: replay
    });

    return (
      <div
        className={root}
        ref={rootEl => this.state.rootEl || this.setState({ rootEl })}
      />
    );
  }
}
