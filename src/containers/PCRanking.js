import * as React from 'react';
import { connect } from 'react-redux';

import WrappedPCRanking from '../components/PCRanking';
import { fetchRecordsByStage, getRecordsByStage } from '../ducks/pcRanking';

const mapStateToProps = (state, ownProps) => {
  const { stage } = ownProps.match.params;

  return {
    records: getRecordsByStage(state, stage)
  };
};

const mapDispatchToProps = {
  fetchRecordsByStage
};

@connect(mapStateToProps, mapDispatchToProps)
export default class PCRanking extends React.Component {
  componentDidMount() {
    const { stage } = this.props.match.params;
    this.props.fetchRecordsByStage(stage);
  }

  componentDidUpdate(prevProps) {
    const { stage } = this.props.match.params;

    if (stage !== prevProps.match.params.stage) {
      this.props.fetchRecordsByStage(stage);
    }
  }

  render() {
    return <WrappedPCRanking {...this.props} />;
  }
}
