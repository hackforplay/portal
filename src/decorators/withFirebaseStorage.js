import * as React from 'react';
import { connect } from 'react-redux';

import { StoreState } from '../ducks';
import { downloadUrl, getStorageByPath } from '../ducks/storage';

const mapStateToProps = (state: StoreState, ownProps) => {
  const storage = getStorageByPath(state, ownProps.storagePath);

  // storage.isEmpty の場合は src に設定されている URL が表示される
  return ownProps.storagePath && !storage.isEmpty
    ? {
        src: storage.url
      }
    : {};
};

const mapDispatchToProps = {
  downloadUrl
};

export default function withFirebaseStorage(WrappedComponent: React.Component) {
  @connect(mapStateToProps, mapDispatchToProps)
  class Component extends React.Component {
    componentDidMount() {
      if (this.props.storagePath) {
        this.props.downloadUrl(this.props.storagePath);
      }
    }

    componentDidUpdate(prevProps) {
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
