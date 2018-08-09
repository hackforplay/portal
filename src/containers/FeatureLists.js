// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import FeatureLists from '../components/FeatureLists';
import type { OwnProps, Props } from '../components/FeatureLists';
import type { StoreState } from '../ducks';
import {
  fetchRecommendedWorks,
  fetchTrendingWorks,
  type WorkCollectionType
} from '../ducks/work';

export type StateProps = {
  lists: {
    recommended: WorkCollectionType,
    trending: WorkCollectionType
  }
};

const mapStateToProps = (state: StoreState, ownProps: OwnProps): StateProps => {
  return {
    lists: {
      recommended: state.work.recommended,
      trending: state.work.trending
    }
  };
};

const mapDispatchToProps = {
  fetchRecommendedWorks,
  fetchTrendingWorks
};

export type DispatchProps = { ...typeof mapDispatchToProps };

@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchRecommendedWorks();
    this.props.fetchTrendingWorks();
  }

  render() {
    return <FeatureLists {...this.props} />;
  }
}
