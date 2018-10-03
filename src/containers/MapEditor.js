// @flow
import { connect } from 'react-redux';

import MapEditor from '../components/MapEditor';
import type { OwnProps } from '../components/MapEditor';
import type { StoreState } from '../ducks';
import { saveNewMapJson } from '../ducks/maps';

export type StateProps = {
  isUploading: boolean
};

const mapStateToProps = (state: StoreState, OwnProps: OwnProps): StateProps => {
  return {
    isUploading: state.maps.isUploading
  };
};

const mapDispatchToProps = {
  saveNewMapJson
};

export type DispatchProps = { ...typeof mapDispatchToProps };

export default connect(mapStateToProps, mapDispatchToProps)(MapEditor);
