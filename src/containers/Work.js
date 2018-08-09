// @flow
import * as React from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import type { ContextRouter, Match } from 'react-router-dom';

import Work from '../components/Work';
import {
  getWorkByPath,
  fetchWorkByPath,
  addWorkView,
  addWorkViewLabel,
  isAuthUsersWork
} from '../ducks/work';
import type { WorkItemType } from '../ducks/work';
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
import type { State as MakeState } from '../ducks/make';

import * as helpers from '../ducks/helpers';
import type { StoreState } from '../ducks';

export type StateProps = {
  work: WorkItemType,
  replay: boolean,
  canSave: boolean,
  canPublish: boolean,
  canRemove: boolean,
  make: MakeState,
  isPreparing?: boolean,
  redirect?: string
};

const getPath = (match: Match) => {
  const { url, params } = match;
  const isWork = url.startsWith('/work');
  if (!params.id) {
    throw new Error(`Work doesn't have id`);
  }
  const path = `/${isWork ? 'works' : 'products'}/${params.id}`;
  return path;
};

const mapStateToProps = (
  state: StoreState,
  ownProps: ContextRouter
): StateProps => {
  const path = getPath(ownProps.match);
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
  addWorkViewLabel,
  saveWork,
  editExistingWork,
  setWorkVisibility,
  setMetadata,
  removeWork
};

export type DispatchProps = { ...typeof mapDispatchToProps };

type Props = StateProps & DispatchProps & { ...ContextRouter };

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(
  class extends React.Component<Props> {
    componentDidMount() {
      const path = getPath(this.props.match);
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
      return <Work {...this.props} />;
    }
  }
);
