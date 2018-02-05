import { connect } from 'react-redux';

import WrappedSearchBar from '../components/SearchBar';

const mapStateToProps = (state, ownProps) => {
  return {
    result: state.work.search.result
  };
};

const mapDispatchToProps = (dispatch, props) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(WrappedSearchBar);
