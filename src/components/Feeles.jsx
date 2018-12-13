// @flow
import * as React from 'react';
import { style, classes, media } from 'typestyle';

import type { StateProps, DispatchProps } from '../containers/Feeles';

const replayClassName = 'replay';
const rootStyle = (padding: number) => ({
  $nest: {
    [`&.${replayClassName}`]: {
      height: `calc(100vh - ${padding * 2}px)`
    }
  },
  height: `calc(100vh - ${padding}px)`
});

const cn = {
  root: style(
    {
      overflow: 'hidden'
    },
    rootStyle(56),
    media(
      {
        minWidth: 0,
        orientation: 'landscape'
      },
      rootStyle(48)
    ),
    media(
      {
        minWidth: 600
      },
      rootStyle(64)
    )
  )
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
    const { src } = this.props;
    const { Feeles, rootEl } = this.state;

    // この辺を render にもっていく
    const props: any = {
      jsonURL: src
    };
    props.onChange = this.props.changeWork;
    props.onMessage = this.props.onMessage;
    props.onThumbnailChange = this.props.thumbnail;
    props.disableLocalSave = true; // デフォルトのメニューを出さない

    return (
      <div
        className={classes(cn.root, replayClassName)}
        ref={rootEl => this.state.rootEl || this.setState({ rootEl })}
      >
        {rootEl && Feeles ? (
          <Feeles
            {...props}
            mini
            openSidebar={this.props.openSidebar}
            rootElement={rootEl}
          />
        ) : null}
      </div>
    );
  }
}
