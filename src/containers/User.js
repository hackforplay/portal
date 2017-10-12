import { connect } from 'react-redux';

import { collection, request, isFetching } from '../actions';
import User from '../components/User';

const query = id => [
  collection('users').where('uid', '==', id),
  collection('users').where('custom_id', '==', id)
];

const filter = (state, id) =>
  state.collections.users.find(
    item => item.uid === id || item.custom_id === id
  );

const mapStateToProps = (state, props) => {
  // /users/:user の :user にあたる文字列
  const userId = props.match.params.user;

  return {
    user: filter(state, userId),
    isFetching: isFetching(state, ...query(userId))
  };
};

const mapDispatchToProps = (dispatch, props) => {
  // /users/:user の :user にあたる文字列
  const userId = props.match.params.user;

  return {
    handleLoad() {
      dispatch(request(...query(userId)));
    }
  };
};

const SpecificUser = connect(mapStateToProps, mapDispatchToProps)(User);
export default SpecificUser;
