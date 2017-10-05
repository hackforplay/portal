import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import { firebase } from './firebase-utils';

const style = {
  name: {
    textAlign: 'center'
  }
};

class User extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  };

  state = {
    user: null
  };

  async componentDidMount() {
    const { match: { params } } = this.props;
    try {
      const db = firebase.firestore();
      const usersRef = db.collection('users');
      const userFromCustomId = await usersRef
        .where('custom_id', '==', params.user)
        .get();
      if (!userFromCustomId.empty) {
        this.setState({ user: userFromCustomId.docs[0] });
        return;
      }
      const userFromUid = await usersRef.where('uid', '==', params.user).get();
      if (!userFromUid.empty) {
        this.setState({ user: userFromUid.docs[0] });
      }
    } catch (error) {
      console.log('Error getting documents: ', error);
    }
  }

  render() {
    const { classes } = this.props;
    const { user } = this.state;
    if (!user) return null;

    return (
      <div className={classes.name}>
        User page of {user.data().display_name}
      </div>
    );
  }
}

export default withStyles(style)(User);
