// @flow
import React from 'react';
import { connect } from 'react-redux';

import WorkList from '../components/WorkList';
import type { OwnProps } from '../components/WorkList';
import { type StoreState } from '../ducks';

export type StateProps = {};

const mapStateToProps = (
  state: StoreState,
  ownProps: OwnProps
): StateProps => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(props => (
  <WorkList {...props} />
));
