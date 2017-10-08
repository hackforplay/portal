import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export const ContainerId = 'firebaseui-auth-container';

class Auth extends Component {
  static propTypes = {
    handleLoad: PropTypes.func.isRequired,
    handleSignOut: PropTypes.func.isRequired,
    isSignedOut: PropTypes.bool.isRequired
  };

  componentDidMount() {
    this.props.handleLoad();
  }

  render() {
    const { isSignedOut, handleSignOut } = this.props;

    const styles = {
      signedIn: {
        display: isSignedOut ? 'none' : 'block'
      },
      signedOut: {
        display: isSignedOut ? 'block' : 'none'
      }
    };

    return (
      <div>
        <Link to="/">Top</Link>
        <button style={styles.signedIn} onClick={handleSignOut}>
          Sign out
        </button>
        <div style={styles.signedOut} id={ContainerId} />
      </div>
    );
  }
}

export default Auth;
