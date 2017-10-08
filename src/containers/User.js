import { connect } from 'react-redux';

import { fetchUser, isFetchingUser, findUser } from '../actions';
import User from '../components/User';

const mapStateToProps = (state, props) => {
  // /users/:user の :user にあたる文字列
  const userId = props.match.params.user;

  return {
    user: findUser(state, userId),
    isFetching: isFetchingUser(state, userId)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  // /users/:user の :user にあたる文字列
  const userId = props.match.params.user;

  return {
    handleLoad() {
      dispatch(fetchUser(userId));
    }
  };
};

const SpecificUser = connect(mapStateToProps, mapDispatchToProps)(User);
export default SpecificUser;
