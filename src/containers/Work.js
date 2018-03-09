import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import WrappedWork from '../components/Work';
import {
  getWorkByPath,
  fetchWorkByPath,
  addWorkView,
  changeWork
} from '../ducks/work';

const mapStateToProps = (state, ownProps) => {
  const { url } = ownProps.match;
  return {
    work: getWorkByPath(state, url)
  };
};

const mapDispatchToProps = {
  changeWork,
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
  render() {
    return <WrappedWork {...this.props} />;
  }
}
