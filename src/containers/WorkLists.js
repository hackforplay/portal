import * as React from 'react';
import { connect } from 'react-redux';

import WorkLists from '../components/WorkLists';
import type { Props as WorkListProps } from '../components/WorkLists';
import type { StoreState } from '../ducks';
import { requestRecommendedWorks, requestTrendingWorks } from '../ducks/work';

const mapStateToProps = (state: StoreState, ownProps: WorkListProps) => {
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
export default class WrappedWorkLists extends React.Component<Props> {
  componentDidMount() {
    this.props.requestRecommendedWorks();
    this.props.requestTrendingWorks();
  }

  render() {
    return <WorkLists {...this.props} />;
  }
}
