import { compose } from 'redux';
import { connect } from 'react-redux';

import withFirebaseStorage from '../decorators/withFirebaseStorage';
import { changeWork } from '../ducks/work';
import Feeles from '../components/Feeles';

const mapStateToProps = (state, ownProps) => ({});

const mapDispatchToProps = {
  changeWork
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFirebaseStorage
)(Feeles);
