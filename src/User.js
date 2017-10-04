import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import { firebase } from './firebase-utils';

const style = {};

class User extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  state = {
    user: null
  };

  async componentDidMount() {
    const { match: { params } } = this.props;
    const db = firebase.database();
    try {
      const snapshot = await db.ref(`/users/${params.user}`).once('value');
      this.setState({ user: snapshot.val() });
    } catch (error) {
      console.log('Error getting documents: ', error);
    }
  }

  render() {
    const { classes } = this.props;
    const { user } = this.state;
    if (!user) return null;

    return <div>User page of {user.display_name}</div>;
  }
}

export default withStyles(style)(User);
