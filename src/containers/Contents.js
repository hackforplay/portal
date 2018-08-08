// @flow
import { connect } from 'react-redux';

import Contents from '../components/Contents';
import type { OwnProps } from '../components/Contents';
import type { StoreState } from '../ducks';

export type StateProps = {};

const mapStateToProps = (state: StoreState, OwnProps: OwnProps): StateProps => {
  return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Contents);
