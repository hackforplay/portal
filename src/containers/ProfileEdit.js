// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { ContextRouter } from 'react-router-dom';

import type { StoreState } from '../ducks';
import {
  fetchUserIfNeeded,
  getUserByUid,
  editAuthUser,
  cancelAuthUserEditing,
  confirmAuthUserEditing
} from '../ducks/user';
import { uploadBlob } from '../ducks/storage';
import Profile from '../components/Profile';
import * as helpers from '../ducks/helpers';

const mapStateToProps = (state: StoreState, ownProps) => {
  // /users/:id の :id にあたる文字列
  const { id } = ownProps.match.params;
  // ログインユーザーと同じか検証
  const isAuthUser = state.auth.user && state.auth.user.uid === id;
  // 編集中のデータを取得
  const editing = state.user.editingByUid[id];

  return {
    user: isAuthUser ? getUserByUid(state, id) : helpers.empty(),
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

type PropsType = typeof mapDispatchToProps & ContextRouter;

@connect(mapStateToProps, mapDispatchToProps)
export default class ProfileEdit extends React.Component<PropsType> {
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
