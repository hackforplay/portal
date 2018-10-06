// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, type ContextRouter } from 'react-router-dom';

import WrappedUserWorks, { type Props } from '../components/UserWorks';
import type { StoreState } from '../ducks';
import {
  getWorksByUserId,
  fetchWorksByUser,
  startObserveOwnWorks,
  type WorkCollectionType
} from '../ducks/work';
import { getUserByUid, type UserType } from '../ducks/user';
import { loadOwnMaps } from '../ducks/maps';

export type StateProps = {
  user: UserType,
  works: WorkCollectionType,
  isOwner: boolean,
  maps: $npm$firebase$firestore$DocumentSnapshot[]
};

const mapStateToProps = (
  state: StoreState,
  props: { ...ContextRouter }
): StateProps => {
  // /users/:id の :id にあたる文字列
  const { id } = props.match.params;

  if (!id) {
    throw new Error('User not found'); // View にエラーを表示
  }

  const authUser = state.auth.user;

  return {
    user: getUserByUid(state, id),
    works: getWorksByUserId(state, id),
    isOwner: authUser ? authUser.uid === id : false,
    maps: authUser ? state.maps.ownDocumentSnapshotsOrderByUpdatedAt : []
  };
};

const mapDispatchToProps = {
  fetchWorksByUser,
  startObserveOwnWorks,
  loadOwnMaps
};

export type DispatchProps = { ...typeof mapDispatchToProps };

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default (class UserWorks extends React.Component<Props> {
  update() {
    if (this.props.isOwner) {
      this.props.startObserveOwnWorks();
      this.props.loadOwnMaps();
    } else {
      this.props.fetchWorksByUser(this.props.user);
    }
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.user !== this.props.user) {
      this.update();
    }
  }

  render() {
    return <WrappedUserWorks {...this.props} />;
  }
});
