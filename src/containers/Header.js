import { connect } from 'react-redux';

import Header from '../components/Header';
import { mockSignIn } from '../ducks/auth';
import type { StoreState } from '../ducks';

const mapStateToProps = (state: StoreState, ownProps) => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  signIn() {
    dispatch(mockSignIn());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
