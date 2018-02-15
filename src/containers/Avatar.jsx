import * as React from 'react';
import { connect } from 'react-redux';
import MuiAvatar from 'material-ui/Avatar';

import { StoreState } from '../ducks';
import { downloadUrl, getStorageByPath } from '../ducks/storage';

const mapStateToProps = (state: StoreState, ownProps) => {
  const storage = getStorageByPath(state, ownProps.storagePath);

  return ownProps.storagePath
    ? {
        src: storage.url || ' '
      }
    : {};
};

const mapDispatchToProps = {
  downloadUrl
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Avatar extends React.Component {
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
    const { storagePath, downloadUrl, ...props } = this.props;
    return <MuiAvatar {...props} />;
  }
}
