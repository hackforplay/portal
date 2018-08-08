// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import type { StoreState } from '../ducks';
import { downloadUrl, getStorageByPath } from '../ducks/storage';

type OwnProps = {
  storagePath?: string,
  alt?: React.Node,
  src?: string
};

type StateProps = {
  src?: string
};

const mapStateToProps = (state: StoreState, ownProps: OwnProps): StateProps => {
  const storage = getStorageByPath(state, ownProps.storagePath);

  // storage.isEmpty の場合は src に設定されている URL が表示される
  //   => available でなければ src に設定されている URL が表示される
  return ownProps.storagePath && storage.isAvailable
    ? {
        src: storage.url
      }
    : {};
};

const mapDispatchToProps = {
  downloadUrl
};

type Props = (OwnProps & StateProps & typeof mapDispatchToProps) | any;

export default function withFirebaseStorage<T>(
  WrappedComponent: React.ComponentType<T>
) {
  @connect(mapStateToProps, mapDispatchToProps)
  class Component extends React.Component<T & Props> {
    componentDidMount() {
      if (this.props.storagePath) {
        this.props.downloadUrl(this.props.storagePath);
      }
    }

    componentDidUpdate(prevProps: Props) {
      if (
        prevProps.storagePath !== this.props.storagePath &&
        this.props.storagePath
      ) {
        this.props.downloadUrl(this.props.storagePath);
      }
    }

    render() {
      // 余分な props を削除する
      const { storagePath, downloadUrl, src, ...props } = this.props;
      if (src) {
        // イメージ
        return <WrappedComponent {...props} src={src} />;
      }
      if (props.alt) {
        // alt を表示
        return props.alt;
      }
      // そのまま描画
      return <WrappedComponent {...props} />;
    }
  }
  return Component;
}
