// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import WrappedPickup from '../components/Pickup';
import { fetchPickupWorks } from '../ducks/work';

const mapStateToProps = (state, ownProps) => ({
  pickup: state.work.pickup
});

const mapDispatchToProps = {
  fetchPickupWorks
};

type Props = typeof mapDispatchToProps;

class Pickup extends React.Component<Props> {
  componentDidMount() {
    console.log('works');
    this.props.fetchPickupWorks();
  }
  render() {
    return <WrappedPickup {...this.props} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pickup);
