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
  confirmAuthUserEditing
} from '../ducks/user';
import { uploadBlob } from '../ducks/storage';
import Profile, { type OwnProps, type Props } from '../components/Profile';
import type { StateProps, DispatchProps } from './ProfileEdit';
import * as helpers from '../ducks/helpers';

const mapStateToProps = (
  state: StoreState,
  ownProps: OwnProps & { ...ContextRouter }
): StateProps => {
  // /users/:id の :id にあたる文字列
  const { id } = ownProps.match.params;
  // 自分かどうか
  const owner = state.auth.user ? state.auth.user.uid === id : false;

  return {
    owner,
    user: id ? getUserByUid(state, id) : helpers.empty()
  };
};

const mapDispatchToProps: DispatchProps = {
  fetchUserIfNeeded,
  editAuthUser,
  cancelAuthUserEditing,
  confirmAuthUserEditing,
  uploadBlob
};

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

    render() {
      return <Profile {...this.props} />;
    }
  }
);
