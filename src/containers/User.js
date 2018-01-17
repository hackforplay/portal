import { connect } from 'react-redux';

import User from '../components/User';
import type { Props } from '../components/User';
import type { StoreState } from '../ducks';

const mapStateToProps = (state: StoreState, props: Props) => {
  // /users/:id の :id にあたる文字列
  const { id } = props.match.params;

  return {
    user: {
      id,
      displayName: `User-${id}`
    },
    lists: {
      public: state.work.recommended,
      private: state.work.recommended,
      likes: state.work.recommended
    }
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {};
};

const SpecificUser = connect(mapStateToProps, mapDispatchToProps)(User);
export default SpecificUser;
