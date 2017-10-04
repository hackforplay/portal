import React, { Component } from 'react';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';

import { firebase } from './firebase-utils';

class SignInButton extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  state = {
    user: null
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });
  }

  render() {
    const { user } = this.state;
    const { history } = this.props;

    return user ? (
      user.displayName
    ) : (
      <Button color="contrast" onClick={() => history.push('/auth')}>
        Sign in
      </Button>
    );
  }
}

export default SignInButton;
