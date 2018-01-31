// @flow
import { connect } from 'react-redux';

import UserWorks from '../components/UserWorks';
import type { Props } from '../components/UserWorks';
import type { StoreState } from '../ducks';

const mapStateToProps = (state: StoreState, props: Props) => {
  // /users/:id の :id にあたる文字列
  const { id } = props.match.params;
  const publicWorks = state.work.byUserId[id] || [];
  const { privates } = state.work;

  // この辺のタイプをヘルパーでいい感じにする

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

export default connect(mapStateToProps, mapDispatchToProps)(UserWorks);
