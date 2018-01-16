import { connect } from 'react-redux';

import Topic from '../components/Topic';
import type { StoreState } from '../ducks';

const mapStateToProps = (state: StoreState, ownProps: Props) => {
  return {
    recommended: state.work.recommended
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Topic);
