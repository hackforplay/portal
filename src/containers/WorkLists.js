import { connect } from 'react-redux';

import WorkLists from '../components/WorkLists';
import type { Props } from '../components/WorkLists';
import type { StoreState } from '../ducks';

const mapStateToProps = (state: StoreState, ownProps: Props) => {
  return {
    lists: {
      recommended: state.work.recommended,
      trending: state.work.trending
    }
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WorkLists);
