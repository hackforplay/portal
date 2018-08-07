// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';

import withFirebaseStorage from '../decorators/withFirebaseStorage';
import { changeWork, setMetadata, thumbnail } from '../ducks/make';
import Feeles from '../components/Feeles';

const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = {
  changeWork,
  setMetadata,
  thumbnail
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFirebaseStorage
)(Feeles);
