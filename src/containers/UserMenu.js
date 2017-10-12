import { connect } from 'react-redux';

import { collection, isFetching } from '../actions';
import UserMenu from '../components/UserMenu';

const query = id => collection('users').where('uid', '==', id);

const filter = (state, id) =>
  state.collections.users.find(item => item.uid === id);

const mapStateToProps = (state, props) => {
  const { initialized, user } = state.auth;

  if (!initialized) {
    // Not initialized
    return {
      isFetching: true
    };
  } else if (!user) {
    // Signed out
    return {
      isFetching: false
    };
  } else {
    // Signed in
    return {
      isFetching: isFetching(state, query(user.uid)),
      user: filter(state, user.uid)
    };
  }
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    handleLoad() {}
  };
};

const SpecificUserMenu = connect(mapStateToProps, mapDispatchToProps)(UserMenu);
export default SpecificUserMenu;
