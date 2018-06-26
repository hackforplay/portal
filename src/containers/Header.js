// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import WrappedHeader from '../components/Header';
import { signInWithGoogle, signOut } from '../ducks/auth';
import { fetchUserIfNeeded, getUserByUid } from '../ducks/user';
import type { StoreState } from '../ducks';

const mapStateToProps = (state: StoreState, ownProps) => {
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

@connect(mapStateToProps, mapDispatchToProps)
class Header extends React.Component<*> {
  componentDidMount() {
    // サインインユーザー
    const { auth } = this.props;

    if (auth.user) {
      this.props.fetchUserIfNeeded(auth.user.uid);
    }
  }

  componentDidUpdate(prevProps: *) {
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
