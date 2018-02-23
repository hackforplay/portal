import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import WrappedWork from '../components/Work';
import { getWorkByPath, fetchWorkByPath } from '../ducks/work';

const mapStateToProps = (state, ownProps) => {
  const { url } = ownProps.match;
  return {
    work: getWorkByPath(state, url)
  };
};

const mapDispatchToProps = {
  fetchWorkByPath
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Work extends React.Component {
  componentDidMount() {
    const { url } = this.props.match;
    this.props.fetchWorkByPath(url);
  }
  render() {
    return <WrappedWork {...this.props} />;
  }
}
