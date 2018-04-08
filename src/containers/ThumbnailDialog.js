import { compose } from 'redux';
import { connect } from 'react-redux';

import withFirebaseStorage from '../decorators/withFirebaseStorage';
import ThumbnailDialog from '../components/ThumbnailDialog';
import { saveWork, setThumbnailFromDataURL } from '../ducks/make';
import type { StoreState } from '../ducks';

const mapStateToProps = (state: StoreState, ownProps) => {
  const workData = state.make.work.data;

  return {
    make: state.make,
    storagePath: workData && workData.thumbnailStoragePath
  };
};

const mapDispatchToProps = {
  saveWork,
  setThumbnailFromDataURL
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFirebaseStorage
)(ThumbnailDialog);
