// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import WrappedTopic from '../components/Topic';
import type { StoreState } from '../ducks';
import { fetchTrendingWorks } from '../ducks/work';

const mapStateToProps = (state: StoreState, ownProps) => {
  return {
    trending: state.work.trending
  };
};

const mapDispatchToProps = {
  fetchTrendingWorks
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Topic extends React.Component<*> {
  componentDidMount() {
    this.props.fetchTrendingWorks();
  }

  render() {
    return <WrappedTopic {...this.props} />;
  }
}
