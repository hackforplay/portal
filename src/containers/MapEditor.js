// @flow
import { connect } from 'react-redux';

import MapEditor from '../components/MapEditor';
import type { OwnProps } from '../components/MapEditor';
import type { StoreState } from '../ducks';

export type StateProps = {};

const mapStateToProps = (state: StoreState, OwnProps: OwnProps): StateProps => {
  return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MapEditor);
