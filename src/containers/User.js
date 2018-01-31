// @flow
import { connect } from 'react-redux';

import User from '../components/User';
import type { Props } from '../components/User';
import type { StoreState } from '../ducks';

const mapStateToProps = (state: StoreState, props: Props) => {
  // /users/:id の :id にあたる文字列
  const { id } = props.match.params;
  const publicWorks = state.work.byUserId[id] || [];
  const { privates } = state.work;

  return {
    lists: {
      public: publicWorks,
      private: privates
    }
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {};
};

const SpecificUser = connect(mapStateToProps, mapDispatchToProps)(User);
export default SpecificUser;
