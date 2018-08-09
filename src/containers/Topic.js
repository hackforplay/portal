// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import Topic, { type Props } from '../components/Topic';
import type { StoreState } from '../ducks';
import { fetchTrendingWorks, type WorkCollectionType } from '../ducks/work';

export type StateProps = {
  trending: WorkCollectionType
};

const mapStateToProps = (state: StoreState, ownProps): StateProps => {
  return {
    trending: state.work.trending
  };
};

const mapDispatchToProps = {
  fetchTrendingWorks
};

export type DispatchProps = { ...typeof mapDispatchToProps };

@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchTrendingWorks();
  }

  render() {
    return <Topic {...this.props} />;
  }
}
