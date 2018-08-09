// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import WrappedPCRanking, { type Props } from '../components/PCRanking';
import {
  fetchRecordsByStage,
  getRecordsByStage,
  type RecordCollectionType
} from '../ducks/pcRanking';

export type StateProps = {
  records: RecordCollectionType
};

const mapStateToProps = (state, ownProps): StateProps => {
  const { stage } = ownProps.match.params;

  return {
    records: getRecordsByStage(state, stage)
  };
};

const mapDispatchToProps = {
  fetchRecordsByStage
};

export type DispatchProps = { ...typeof mapDispatchToProps };

@connect(mapStateToProps, mapDispatchToProps)
export default class PCRanking extends React.Component<Props> {
  componentDidMount() {
    const { stage } = this.props.match.params;
    this.props.fetchRecordsByStage(stage);
  }

  componentDidUpdate(prevProps: any) {
    const { stage } = this.props.match.params;

    if (stage !== prevProps.match.params.stage) {
      this.props.fetchRecordsByStage(stage);
    }
  }

  render() {
    return <WrappedPCRanking {...this.props} />;
  }
}
