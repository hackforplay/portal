// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { ContextRouter } from 'react-router-dom';

import WrappedHeader from '../components/Header';
import { signInWithGoogle, signOut } from '../ducks/auth';
import { fetchUserIfNeeded, getUserByUid } from '../ducks/user';
import type { UserType } from '../ducks/user';
import type { State as AuthType } from '../ducks/auth';
import type { StoreState } from '../ducks';

const mapStateToProps = (state: StoreState, ownProps) => {
  // サインインユーザー
  const { auth } = state;
  const id = auth.user && auth.user.uid;
  const user = getUserByUid(state, id || '');

  return {
    authUser: auth.user,
    auth,
    user
  };
};

const mapDispatchToProps = {
  signInWithGoogle,
  signOut,
  fetchUserIfNeeded
};

type PropsType = typeof mapDispatchToProps &
  ContextRouter & {
    auth: AuthType,
    user?: UserType
  };

@connect(mapStateToProps, mapDispatchToProps)
class Header extends React.Component<PropsType> {
  componentDidMount() {
    // サインインユーザー
    const { auth } = this.props;

    if (auth.user) {
      this.props.fetchUserIfNeeded(auth.user.uid);
    }
  }

  componentDidUpdate(prevProps: PropsType) {
    const { auth } = this.props;
    if (auth !== prevProps.auth && auth.user) {
      this.props.fetchUserIfNeeded(auth.user.uid);
    }
  }

  render() {
    return <WrappedHeader {...this.props} />;
  }
}

export default Header;
