import * as React from 'react';
import { connect } from 'react-redux';
import type { ContextRouter } from 'react-router-dom';

import { fetchItemBySearch, getWorkBySearch } from '../ducks/work';
import WrappdedWork from '../components/Work';

const mapStateToProps = (state, ownProps) => {
  const { search } = ownProps.match.params;
  return {
    work: getWorkBySearch(state, search)
  };
};

const mapDispatchToProps = {
  fetchItemBySearch
};

type Props = typeof mapDispatchToProps & ContextRouter;

class Work extends React.Component<Props> {
  componentDidMount() {
    const { search } = this.props.match.params;
    this.props.fetchItemBySearch(search);
  }
  render() {
    return <WrappdedWork {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Work);
