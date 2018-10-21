// @flow
import React from 'react';
import { connect } from 'react-redux';

import MapList, { type OwnProps } from '../components/MapList';
import { type StoreState } from '../ducks';
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

const mapDispatchToProps = {};

export type DispatchProps = { ...typeof mapDispatchToProps };

export default connect(mapStateToProps, mapDispatchToProps)(props => (
  <MapList {...props} />
));
