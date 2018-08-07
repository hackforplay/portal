// @flow
import { connect } from 'react-redux';

import Profile from '../components/Profile';
import * as helpers from '../ducks/helpers';

const mapStateToProps = (state, ownProps) => {
  const { nickname } = ownProps.match.params;
  return {
    owner: false,
    user: helpers.has({
      displayName: nickname
    })
  };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
