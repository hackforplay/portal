import firebase from './firebase';
import firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

import { fetchUser } from './users';

// FirebaseUI config.
const uiConfig = {
  signInSuccessUrl: '/auth',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>'
};

export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';

const signedIn = user => {
  return {
    type: SIGN_IN,
    user
  };
};

const signedOut = () => {
  return {
    type: SIGN_OUT
  };
};

let isObserved = false;
export const init = () => (dispatch, getState) => {
  if (!isObserved) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        dispatch(signedIn(user));
        dispatch(fetchUser(user.uid));
      } else {
        // User is signed out.
        dispatch(signedOut());
      }
    });
    isObserved = true;
  }
};

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(firebase.auth());
export const renderAuthUI = ContainerId => (dispatch, getState) => {
  // The start method will wait until the DOM is loaded.
  ui.start(`#${ContainerId}`, uiConfig);
};

export const signOut = () => (dispatch, getState) => {
  firebase.auth().signOut();
};
