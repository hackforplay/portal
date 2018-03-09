import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import WrappedWork from '../components/Work';
import {
  getWorkByPath,
  fetchWorkByPath,
  addWorkView,
  changeWork,
  trashWork
} from '../ducks/work';
import type { StoreState } from '../ducks';

const mapStateToProps = (state: StoreState, ownProps) => {
  const { url } = ownProps.match;
  return {
    work: getWorkByPath(state, url),
    creating: state.work.creating
  };
};

const mapDispatchToProps = {
  changeWork,
  trashWork,
  fetchWorkByPath,
  addWorkView
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Work extends React.Component {
  componentDidMount() {
    const { url } = this.props.match;
    // 作品データがなければ取得
    this.props.fetchWorkByPath(url);
    // 作品のビューカウントを増やす
    this.props.addWorkView(url);
  }

  componentWillUnmount() {
    this.props.trashWork();
  }

  render() {
    return <WrappedWork {...this.props} />;
  }
}
