import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import WrappedWork from '../components/Work';
import { getWorkById, fetchWorkById } from '../ducks/work';

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  return {
    work: getWorkById(state, id)
  };
};

const mapDispatchToProps = {
  fetchWorkById
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Work extends React.Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchWorkById(id);
  }
  render() {
    return <WrappedWork {...this.props} />;
  }
}
