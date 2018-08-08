// @flow
import { connect } from 'react-redux';

import WorkList from '../components/WorkList';
import type { OwnProps } from '../components/WorkList';

export type StateProps = {};

const mapStateToProps = (state: any, ownProps: OwnProps): StateProps => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WorkList);
