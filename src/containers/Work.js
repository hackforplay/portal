import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import WrappedWork from '../components/Work';
import {
  getWorkByPath,
  fetchWorkByPath,
  addWorkView,
  isAuthUsersWork
} from '../ducks/work';
import {
  trashWork,
  saveWork,
  editExistingWork,
  setWorkVisibility,
  setMetadata,
  canSave,
  canPublish,
  canRemove,
  removeWork
} from '../ducks/make';
import * as helpers from '../ducks/helpers';
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
  const replay = isAuthUsersWork(state, path);
  const isPreparing = replay && helpers.isInitialized(state.make.work);
  return {
    work: getWorkByPath(state, path),
    make: state.make,
    canSave: canSave(state),
    canPublish: canPublish(state),
    canRemove: canRemove(state),
    replay,
    // アセットのロードが Feeles 側より早く終わるよう,
    // editExistingWork が終わるのを待つ
    isPreparing
  };
};

const mapDispatchToProps = {
  trashWork,
  fetchWorkByPath,
  addWorkView,
  saveWork,
  editExistingWork,
  setWorkVisibility,
  setMetadata,
  removeWork
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Work extends React.Component {
  componentDidMount() {
    const { url, params } = this.props.match;
    const path = getPath(url, params);
    // ステージデータがなければ取得
    this.props.fetchWorkByPath(path).then(() => {
      // ステージのビューカウントを増やす
      this.props.addWorkView(path);
    });
    if (this.props.replay) {
      this.props.editExistingWork(this.props.work);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.replay !== nextProps.replay && nextProps.replay) {
      this.props.editExistingWork(nextProps.work);
    }
  }

  componentWillUnmount() {
    this.props.trashWork();
  }

  render() {
    return <WrappedWork {...this.props} />;
  }
}
