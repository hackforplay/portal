// @flow
import { connect } from 'react-redux';

import OptionalHeader from '../components/OptionalHeader';
import type { OwnProps } from '../components/OptionalHeader';
import type { StoreState } from '../ducks';

export type StateProps = {};

const mapStateToProps = (state: StoreState, OwnProps: OwnProps): StateProps => {
  return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(OptionalHeader);
