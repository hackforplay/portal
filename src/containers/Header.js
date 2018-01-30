import { connect } from 'react-redux';

import Header from '../components/Header';
import { signInWithGoogle, signOut } from '../ducks/auth';
import type { StoreState } from '../ducks';

const mapStateToProps = (state: StoreState, ownProps) => ({
  auth: state.auth
});

const mapDispatchToProps = {
  signInWithGoogle,
  signOut
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
