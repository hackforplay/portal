// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { ContextRouter } from 'react-router-dom';

import type { StoreState } from '../ducks';
import { fetchUserIfNeeded, getUserByUid } from '../ducks/user';
import WrappedProfile from '../components/Profile';

const mapStateToProps = (state: StoreState, ownProps) => {
  // /users/:id の :id にあたる文字列
  const { id } = ownProps.match.params;
  // 自分かどうか
  const owner = state.auth.user ? state.auth.user.uid === id : false;

  return {
    owner,
    user: getUserByUid(state, id)
  };
};

const mapDispatchToProps = {
  fetchUserIfNeeded
};

type PropsType = typeof mapDispatchToProps & ContextRouter;

@connect(mapStateToProps, mapDispatchToProps)
class Profile extends React.Component<PropsType> {
  componentDidMount() {
    // /users/:id の :id にあたる文字列
    const { id } = this.props.match.params;
    this.props.fetchUserIfNeeded(id);
  }

  render() {
    return <WrappedProfile {...this.props} />;
  }
}

export default Profile;
