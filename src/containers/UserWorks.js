// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import WrappedUserWorks from '../components/UserWorks';
import type { Props } from '../components/UserWorks';
import type { StoreState } from '../ducks';
import { getWorksByUserId, fetchWorksByUser } from '../ducks/work';
import { getUserByUid } from '../ducks/user';
import type { UserType } from '../ducks/user';

const mapStateToProps = (state: StoreState, props: Props) => {
  // /users/:id の :id にあたる文字列
  const { id } = props.match.params;

  return {
    user: getUserByUid(state, id),
    lists: {
      public: getWorksByUserId(state, id),
      private: []
    }
  };
};

const mapDispatchToProps = {
  fetchWorksByUser
};

type PropsType = typeof mapDispatchToProps & {
  user: UserType
};

@connect(mapStateToProps, mapDispatchToProps)
export default class UserWorks extends React.Component<PropsType> {
  componentDidMount() {
    this.props.fetchWorksByUser(this.props.user);
  }

  componentDidUpdate(prevProps: PropsType) {
    if (prevProps.user !== this.props.user) {
      this.props.fetchWorksByUser(this.props.user);
    }
  }

  render() {
    return <WrappedUserWorks {...this.props} />;
  }
}
