import { connect } from 'react-redux';

import type { StoreState } from '../ducks';
import Profile from '../components/Profile';

const mapStateToProps = (state: StoreState, ownProps) => {
  // /users/:id の :id にあたる文字列
  const { id } = ownProps.match.params;
  const user = state.user.users[id];

  return {
    user
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
