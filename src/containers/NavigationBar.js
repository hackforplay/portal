// @flow
import { connect } from 'react-redux';

import NavigationBar from '../components/NavigationBar';
import type { OwnProps } from '../components/NavigationBar';
import type { StoreState } from '../ducks';

export type StateProps = {};

const mapStateToProps = (state: StoreState, OwnProps: OwnProps): StateProps => {
    return {};
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);