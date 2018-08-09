// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';

import withFirebaseStorage from '../decorators/withFirebaseStorage';
import { changeWork, setMetadata, thumbnail } from '../ducks/make';
import Feeles from '../components/Feeles';
import type { OwnProps } from '../components/Feeles';

export type StateProps = {};

const mapStateToProps = (state, ownProps: OwnProps): StateProps => ({});

const mapDispatchToProps = {
  changeWork,
  setMetadata,
  thumbnail
};

export type DispatchProps = { ...typeof mapDispatchToProps };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFirebaseStorage
)(Feeles);
