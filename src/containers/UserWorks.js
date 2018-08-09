// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import WrappedUserWorks, { type Props } from '../components/UserWorks';
import type { StoreState } from '../ducks';
import {
  getWorksByUserId,
  fetchWorksByUser,
  type WorkCollectionType
} from '../ducks/work';
import { getUserByUid } from '../ducks/user';

export type StateProps = {
  works: WorkCollectionType
};

const mapStateToProps = (state: StoreState, props: Props) => {
  // /users/:id の :id にあたる文字列
  const { id } = props.match.params;

  return {
    user: getUserByUid(state, id || ''),
    works: getWorksByUserId(state, id || '')
  };
};

const mapDispatchToProps = {
  fetchWorksByUser
};

export type DispatchProps = { ...typeof mapDispatchToProps };

@connect(mapStateToProps, mapDispatchToProps)
export default class UserWorks extends React.Component<*> {
  componentDidMount() {
    this.props.fetchWorksByUser(this.props.user);
  }

  componentDidUpdate(prevProps: *) {
    if (prevProps.user !== this.props.user) {
      this.props.fetchWorksByUser(this.props.user);
    }
  }

  render() {
    return <WrappedUserWorks {...this.props} />;
  }
}
