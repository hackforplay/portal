// @flow
import { connect } from 'react-redux';
import type { MapStateToProps, MapDispatchToProps } from 'react-redux';

import Contents from '../components/Contents';
import type { OwnProps } from '../components/Contents';

export type StateProps = {};

const mapStateToProps: MapStateToProps<*, OwnProps, StateProps> = () => ({});

export type DispatchProps = *;

const mapDispatchToProps: MapDispatchToProps<{}, OwnProps, DispatchProps> = (
  dispatch,
  ownProps
) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Contents);
