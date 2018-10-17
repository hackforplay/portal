// @flow
import * as React from 'react';
import { style, classes } from 'typestyle';

import type { StateProps, DispatchProps } from '../containers/Feeles';

const replayClassName = 'replay';
const rootStyle = (padding: number) => ({
  [`&.${replayClassName}`]: {
    height: `calc(100vh - ${padding * 2}px)`
  },
  height: `calc(100vh - ${padding}px)`
});

const cn = {
  root: style({
    ...rootStyle(56),
    '@media (min-width:0px) and (orientation: landscape)': {
      ...rootStyle(48)
    },
    '@media (min-width:600px)': {
      ...rootStyle(64)
    },
    overflow: 'hidden'
  })
};

export type OnMessage = (event: {
  data: { value: { labelName: string, labelValue: string, href: string } }
}) => void;

export type OwnProps = {
  onMessage: OnMessage,
  src: string | void,
  replay: boolean,
  openSidebar: boolean
};

type State = {
  rootEl: ?HTMLElement,
  loading: boolean,
  Feeles: null | React.ComponentType<*>
};

type Props = OwnProps & StateProps & DispatchProps;

export default class Feeles extends React.Component<Props, State> {
  static defaultProps = {
    onMessage: () => {},
    src: ''
  };

  state = {
    rootEl: null,
    loading: true,
    Feeles: null
  };

  componentDidMount() {
    this.handleLoad();
  }

  componentDidUpdate() {
    this.handleLoad();
  }

  async handleLoad() {
    const { src } = this.props;
    if (this.state.loading && src) {
      const feeles = await import('feeles-ide/lib/jsx/RootComponent');
      this.setState({
        Feeles: feeles.default,
        loading: false
      });
    }
  }

  render() {
    const { src, replay } = this.props;
    const { Feeles, rootEl } = this.state;

    // この辺を render にもっていく
    const props: any = {
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

    return (
      <div
        className={classes(cn.root, replay && replayClassName)}
        ref={rootEl => this.state.rootEl || this.setState({ rootEl })}
      >
        {rootEl && Feeles ? (
          <Feeles
            {...props}
            mini={this.props.replay}
            openSidebar={this.props.openSidebar}
            rootElement={rootEl}
          />
        ) : null}
      </div>
    );
  }
}
