import { connect } from 'react-redux';

import { renderAuthUI, signOut } from '../actions';
import Auth from '../components/Auth';
import { ContainerId } from '../components/Auth';

const mapStateToProps = (state, props) => {
  const { initialized, user } = state.auth;
  return {
    isSignedOut: initialized && user === null
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    handleLoad() {
      dispatch(renderAuthUI(ContainerId));
    },
    handleSignOut() {
      dispatch(signOut());
    }
  };
};

const ShowAuth = connect(mapStateToProps, mapDispatchToProps)(Auth);
export default ShowAuth;
