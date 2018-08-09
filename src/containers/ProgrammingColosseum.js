// @flow
import { connect } from 'react-redux';

import ProgrammingColosseum from '../components/ProgrammingColosseum';
import type { StoreState } from '../ducks';

export type StateProps = {};

const mapStateToProps = (state: StoreState, OwnProps: {}): StateProps => {
  return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(
  ProgrammingColosseum
);
