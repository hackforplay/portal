// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import WrappedFeatureLists from '../components/FeatureLists';
import type { Props as FeatureListsProps } from '../components/FeatureLists';
import type { StoreState } from '../ducks';
import { requestRecommendedWorks, requestTrendingWorks } from '../ducks/work';

const mapStateToProps = (state: StoreState, ownProps: FeatureListsProps) => {
  return {
    lists: {
      recommended: state.work.recommended.data,
      trending: state.work.trending.data
    }
  };
};

const mapDispatchToProps = {
  requestRecommendedWorks,
  requestTrendingWorks
};

type Props = typeof mapDispatchToProps;

@connect(mapStateToProps, mapDispatchToProps)
export default class FeatureLists extends React.Component<Props> {
  componentDidMount() {
    this.props.requestRecommendedWorks();
    this.props.requestTrendingWorks();
  }

  render() {
    return <WrappedFeatureLists {...this.props} />;
  }
}
