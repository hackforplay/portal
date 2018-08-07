// @flow
import * as React from 'react';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

import type { changeWorkType, thumbnailType } from '../ducks/make';

type Props = {
  onMessage?: () => {},
  changeWork: changeWorkType,
  thumbnail: thumbnailType,
  src: string | void,
  replay: boolean,
  classes: {
    root: string
  }
};

type State = {
  rootEl: ?HTMLElement,
  loading: boolean
};

const replayClassName = 'replay';
export const rootStyle = (padding: number) => ({
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
  static defaultProps = {
    onMessage: () => {},
    src: ''
  };

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
    if (this.state.rootEl) {
      import('feeles-ide').then(({ h4p }) => {
        h4p.unmount(this.state.rootEl);
      });
    }
  }

  handleLoad() {
    const { src, replay } = this.props;
    if (this.state.loading && this.state.rootEl && src) {
      this.setState({ loading: false }, () => {
        const props = {
          rootElement: this.state.rootEl,
          jsonURL: src
        };
        // TODO: Feeles の機能をなくして portal の機能に一元化する
        // Feeles の機能と portal の機能が両立している場合があるので,
        // replay === false でも onChange は捉える
        props.onChange = this.props.changeWork;
        props.onMessage = this.props.onMessage;
        props.onThumbnailChange = this.props.thumbnail;
        if (replay) {
          props.disableLocalSave = true; // デフォルトのメニューを出さない
          props.disableScreenShotCard = true; // スクリーンショットカードを無効化
        }
        // WIP
        // TODO: ScreenShot Card の廃止
        // 暫定的に make-rpg 以外では thumbnail の機能を排除する
        if (!replay && window.location.pathname !== '/officials/make-rpg') {
          delete props.onThumbnailChange;
        }
        import('feeles-ide').then(({ h4p }) => {
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
