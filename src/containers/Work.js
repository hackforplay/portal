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

const getPath = (url: string, params: {}) => {
  const isWork = url.startsWith('/work');
  const id = params && params.id;
  const path = `/${isWork ? 'works' : 'products'}/${id}`;
  return path;
};

const mapStateToProps = (state: StoreState, ownProps): string => {
  const { url, params } = ownProps.match;
  const path = getPath(url, params);
  return {
    work: getWorkByPath(state, path),
    creating: state.work.creating,
    replay: params && params.action === 'replay'
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
    const { url, params } = this.props.match;
    const path = getPath(url, params);
    // 作品データがなければ取得
    this.props.fetchWorkByPath(path);
    // 作品のビューカウントを増やす
    this.props.addWorkView(path);
  }

  componentWillUnmount() {
    this.props.trashWork();
  }

  render() {
    return <WrappedWork {...this.props} />;
  }
}
