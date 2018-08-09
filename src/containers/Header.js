// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, type ContextRouter } from 'react-router-dom';

import Header, { type OwnProps, type Props } from '../components/Header';
import {
  signInWithGoogle,
  signOut,
  type State as AuthState
} from '../ducks/auth';
import { fetchUserIfNeeded, getUserByUid, type UserType } from '../ducks/user';
import type { StoreState } from '../ducks';

export type StateProps = {
  isSignedIn: boolean,
  auth: AuthState,
  user: UserType,
  isInOfficialWork: boolean
};

const mapStateToProps = (
  state: StoreState,
  ownProps: OwnProps & { ...ContextRouter }
): StateProps => {
  // サインインユーザー
  const { auth } = state;
  const id = auth.user && auth.user.uid;
  const user = getUserByUid(state, id || '');
  const isInOfficialWork = ownProps.location.pathname.startsWith('/officials/');

  return {
    isSignedIn: !!auth.user,
    auth,
    user,
    isInOfficialWork
  };
};

const mapDispatchToProps = {
  signInWithGoogle,
  signOut,
  fetchUserIfNeeded
};

export type DispatchProps = { ...typeof mapDispatchToProps };

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.Component<Props> {
  componentDidMount() {
    // サインインユーザー
    const { auth } = this.props;

    if (auth.user) {
      this.props.fetchUserIfNeeded(auth.user.uid);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { auth } = this.props;
    if (auth !== prevProps.auth && auth.user) {
      this.props.fetchUserIfNeeded(auth.user.uid);
    }
  }

  render() {
    return <Header {...this.props} />;
  }
}
