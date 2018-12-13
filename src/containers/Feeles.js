// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';

import withFirebaseStorage from '../decorators/withFirebaseStorage';
import { changeWork, actions } from '../ducks/make';
import Feeles from '../components/Feeles';
import type { OwnProps } from '../components/Feeles';

export type StateProps = {};

const mapStateToProps = (state, ownProps: OwnProps): StateProps => ({});

const mapDispatchToProps = {
  changeWork,
  setAssetVersion: ver => dispatch => dispatch(actions.assetVersion(ver)),
  thumbnail: dataUrl => dispatch => dispatch(actions.thumbnail(dataUrl))
};

export type DispatchProps = { ...typeof mapDispatchToProps };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withFirebaseStorage
)(Feeles);
