import { connect } from 'react-redux';

import { findUser, isFetchingUser } from '../actions';
import UserMenu from '../components/UserMenu';

const mapStateToProps = (state, props) => {
  const { initialized, user } = state.auth;

  return {
    isFetching: !initialized || !!(user && isFetchingUser(state, user.uid)),
    user: user && findUser(state, user.uid)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    handleLoad() {}
  };
};

const SpecificUserMenu = connect(mapStateToProps, mapDispatchToProps)(UserMenu);
export default SpecificUserMenu;
