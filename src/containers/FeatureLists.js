// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import WrappedFeatureLists from '../components/FeatureLists';
import type { Props as FeatureListsProps } from '../components/FeatureLists';
import type { StoreState } from '../ducks';
import { fetchRecommendedWorks, fetchTrendingWorks } from '../ducks/work';

const mapStateToProps = (state: StoreState, ownProps: FeatureListsProps) => {
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

type Props = typeof mapDispatchToProps;

@connect(mapStateToProps, mapDispatchToProps)
export default class FeatureLists extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchRecommendedWorks();
    this.props.fetchTrendingWorks();
  }

  render() {
    return <WrappedFeatureLists {...this.props} />;
  }
}
