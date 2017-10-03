import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { firebase, renderWidget } from './firebase-utils';

const ContainerId = 'firebaseui-auth-container';

class Auth extends Component {
  state = {
    currentUser: null
  };
  componentDidMount() {
    renderWidget(ContainerId);

    const auth = firebase.auth();
    this.setState({ currentUser: auth.currentUser });
    auth.onAuthStateChanged(user => {
      this.setState({ currentUser: user });
    });
  }
  handleSignOut() {
    firebase.auth().signOut();
  }
  render() {
    const isSignedIn = this.state.currentUser !== null;

    const styles = {
      signedOut: {
        display: isSignedIn ? 'none' : 'block'
      }
    };
    return (
      <div>
        <Link to="/">Top</Link>
        {isSignedIn ? (
          <div style={styles.signedIn}>
            <h1>Hi, {this.state.currentUser.displayName}</h1>
            <button onClick={this.handleSignOut}>Sign out</button>
          </div>
        ) : null}
        <div style={styles.signedOut} id={ContainerId} />
      </div>
    );
  }
}

export default Auth;
