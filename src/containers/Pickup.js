// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import Pickup, { type Props } from '../components/Pickup';
import { fetchPickupWorks, type WorkCollectionType } from '../ducks/work';

export type StateProps = {
  pickup: WorkCollectionType
};

const mapStateToProps = (state, ownProps) => ({
  pickup: state.work.pickup
});

const mapDispatchToProps = {
  fetchPickupWorks
};

export type DispatchProps = { ...typeof mapDispatchToProps };

@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPickupWorks();
  }
  render() {
    return <Pickup {...this.props} />;
  }
}
