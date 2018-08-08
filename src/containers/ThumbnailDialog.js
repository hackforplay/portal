// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';

import withFirebaseStorage from '../decorators/withFirebaseStorage';
import ThumbnailDialog from '../components/ThumbnailDialog';
import { saveWork, setThumbnailFromDataURL } from '../ducks/make';
import type { StoreState } from '../ducks';
import type { State as MakeState } from '../ducks/make';

export type StateProps = {
  make: MakeState
};

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

export type DispatchProps = typeof mapDispatchToProps;

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFirebaseStorage
)(ThumbnailDialog);
