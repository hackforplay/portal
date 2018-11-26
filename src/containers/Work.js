// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { ContextRouter, Match } from 'react-router-dom';

import Work from '../components/Work';
import * as helpers from '../ducks/helpers';

import {
  addWorkViewLabel,
  getWorkByPath,
  fetchWorkByPath,
  addWorkView,
  isAuthUsersWork,
  type WorkItemType
} from '../ducks/work';
import * as officialWork from '../ducks/officialWork';
import {
  actions,
  changeWork,
  saveWork,
  editExistingWork,
  setWorkVisibility,
  canSave,
  canPublish,
  canRemove,
  removeWork
} from '../ducks/make';
import type { State as MakeState } from '../ducks/make';
import * as authImport from '../ducks/auth';

import type { StoreState } from '../ducks';

export type StateProps = {
  isSignedIn: boolean,
  work: WorkItemType,
  replay: boolean,
  canSave: boolean,
  canPublish: boolean,
  canRemove: boolean,
  make: MakeState,
  isPreparing?: boolean,
  redirect?: string,
  renderNull: boolean,
  slaask: boolean
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

const isOfficial = (match: Match) => {
  return match.url.startsWith('/officials');
};

const mapStateToProps = (
  state: StoreState,
  ownProps: ContextRouter
): StateProps => {
  const isSignedIn = Boolean(authImport.getState(state).user);
  if (isOfficial(ownProps.match)) {
    const { location } = ownProps;
    // 現在表示している URL にふさわしいデータソースを取得する
    // 現在のパスをもとに, 最適なコンテンツをサーバから取得

    const source = officialWork.get(state, location.pathname);
    const work = source ? source.work : helpers.invalid('Not Found');
    const replayable = source ? source.replayable : false;
    const makeWorkData = state.make.work.data;
    return {
      isSignedIn,
      work,
      make: state.make,
      replay: replayable && isSignedIn,
      canSave: canSave(state),
      canPublish: canPublish(state),
      canRemove: canRemove(state),
      // official(キット)を保存したとき /works/{id} にリダイレクトする
      // render できたら redirect する
      redirect:
        makeWorkData && makeWorkData.id ? `/works/${makeWorkData.id}` : '',
      // URL が間違っているとき null を render する
      // replay かどうかを確かめるために onAuthStateChanged を待つ
      renderNull: !state.auth.initialized,
      // slaask widget を表示するかどうかを決めるフラグ
      slaask: source.slaask
    };
  }

  const path = getPath(ownProps.match);
  const replay = isAuthUsersWork(state, path);
  const isPreparing = replay && helpers.isInitialized(state.make.work);
  return {
    isSignedIn,
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
  fetchWork: officialWork.fetchWork,
  addWorkViewLabel,
  changeWork,
  trashWork: () => dispatch => dispatch(actions.trash()),
  fetchWorkByPath,
  addWorkView,
  saveWork,
  editExistingWork,
  setWorkVisibility,
  setMetadata: () => dispatch => dispatch(actions.metadata()),
  removeWork
};

export type DispatchProps = { ...typeof mapDispatchToProps };

type Props = StateProps & DispatchProps & { ...ContextRouter };

@withRouter
@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends React.Component<Props> {
  componentDidMount() {
    if (isOfficial(this.props.match)) {
      if (helpers.isInitialized(this.props.work)) {
        // 現在のパスからデータを取得する
        const { pathname } = this.props.location;
        this.props.fetchWork(pathname);
      }
      this.toggleSlaask(this.props.slaask);
    } else {
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
  }

  toggleSlaask(showing: boolean) {
    const slaaskButton = document.querySelector('#slaask-button');
    if (slaaskButton) {
      slaaskButton.style.display = showing ? 'block' : 'none';
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.replay !== nextProps.replay && nextProps.replay) {
      this.props.editExistingWork(nextProps.work);
    }
    if (this.props.slaask !== nextProps.slaask) {
      // Slaask の表示・非表示
      this.toggleSlaask(nextProps.slaask);
    }
  }

  componentWillUnmount() {
    this.props.trashWork();
    this.toggleSlaask(true);
  }

  render() {
    const { renderNull, ...props } = this.props;

    if (renderNull) {
      return null;
    }

    return <Work {...props} />;
  }
}
