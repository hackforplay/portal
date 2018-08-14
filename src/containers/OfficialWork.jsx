// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router-dom';

import Work from '../components/Work';
import type { StateProps as WorkStateProps } from '../containers/Work';
import * as helpers from '../ducks/helpers';
import { addWorkViewLabel } from '../ducks/work';
import * as officialWork from '../ducks/officialWork';
import {
  changeWork,
  trashWork,
  saveWork,
  setWorkVisibility,
  setMetadata,
  canSave,
  canPublish,
  canRemove,
  removeWork
} from '../ducks/make';

import type { StoreState } from '../ducks';

export type StateProps = WorkStateProps & {
  renderNull: boolean,
  slaask: boolean
};

const mapStateToProps = (
  state: StoreState,
  ownProps: ContextRouter
): StateProps => {
  const { location } = ownProps;

  // 現在表示している URL にふさわしいデータソースを取得する
  // 現在のパスをもとに, 最適なコンテンツをサーバから取得

  const source = officialWork.get(state, location.pathname);
  const work = source ? source.work : helpers.invalid('Not Found');
  const replayable = source ? source.replayable : false;
  const makeWorkData = state.make.work.data;

  return {
    work,
    make: state.make,
    replay: replayable && !!state.auth.user,
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
};

const mapDispatchToProps = {
  fetchWork: officialWork.fetchWork,
  addWorkViewLabel,
  changeWork,
  trashWork,
  saveWork,
  setWorkVisibility,
  setMetadata,
  removeWork
};

type Props = StateProps & { ...typeof mapDispatchToProps, ...ContextRouter };

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class OfficialWork extends React.Component<Props> {
  componentDidMount() {
    if (helpers.isInitialized(this.props.work)) {
      // 現在のパスからデータを取得する
      const { pathname } = this.props.location;
      this.props.fetchWork(pathname);
    }
  }

  toggleSlaask(showing: boolean) {
    const slaaskButton = document.querySelector('#slaask-button');
    if (slaaskButton) {
      slaaskButton.style.display = showing ? 'block' : 'none';
    }
  }

  componentWillReceiveProps(nextProps: Props) {
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
