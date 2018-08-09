// @flow
import { connect } from 'react-redux';

import WrappedSearchBar, { type OwnProps } from '../components/SearchBar';
import { type WorkCollectionType } from '../ducks/work';
import { type StoreState } from '../ducks';

export type StateProps = {
  result: WorkCollectionType
};

const mapStateToProps = (state: StoreState, ownProps: OwnProps): StateProps => {
  return {
    result: state.work.search.result
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WrappedSearchBar);
