// @flow
import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, type ContextRouter } from 'react-router-dom';

import type { StoreState } from '../ducks';
import {
  fetchUserIfNeeded,
  getUserByUid,
  editAuthUser,
  cancelAuthUserEditing,
  confirmAuthUserEditing,
  type UserType,
  type EditingUserData
} from '../ducks/user';
import { uploadBlob } from '../ducks/storage';
import Profile, { type OwnProps, type Props } from '../components/Profile';
import * as helpers from '../ducks/helpers';

export type StateProps = {
  owner: boolean,
  user: UserType,
  editing?: EditingUserData
};

const mapStateToProps = (state: StoreState, ownProps) => {
  // /users/:id の :id にあたる文字列
  const { id } = ownProps.match.params;
  // ログインユーザーと同じか検証
  const owner = state.auth.user ? state.auth.user.uid === id : false;
  // 編集中のデータを取得
  const editing = state.user.editingByUid[id];

  return {
    owner,
    user: owner ? getUserByUid(state, id) : helpers.empty(),
    editing
  };
};

const mapDispatchToProps = {
  fetchUserIfNeeded,
  editAuthUser,
  cancelAuthUserEditing,
  confirmAuthUserEditing,
  uploadBlob
};

export type DispatchProps = { ...typeof mapDispatchToProps };

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(
  class extends React.Component<Props> {
    componentDidMount() {
      // /users/:id の :id にあたる文字列
      const { id } = this.props.match.params;
      this.props.fetchUserIfNeeded(id);
    }

    componentWillUnmount() {
      this.props.cancelAuthUserEditing();
    }

    render() {
      return <Profile {...this.props} edit />;
    }
  }
);
