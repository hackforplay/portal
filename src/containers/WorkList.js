// @flow
import React from 'react';
import { connect } from 'react-redux';

import WorkList from '../components/WorkList';
import type { OwnProps } from '../components/WorkList';
import { type StoreState } from '../ducks';
import { removeWork } from '../ducks/work';
import { type AuthUser } from '../ducks/auth';

export type StateProps = {
  authUser?: AuthUser
};

const mapStateToProps = (state: StoreState, ownProps: OwnProps): StateProps => {
  const authUser = state.auth.user;
  return {
    authUser
  };
};

const mapDispatchToProps = {
  removeWork
};

export type DispatchProps = { ...typeof mapDispatchToProps };

export default connect(mapStateToProps, mapDispatchToProps)(props => (
  <WorkList {...props} />
));
