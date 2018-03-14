// @flow
import firebase from 'firebase';

import type { Dispatch, GetState } from './';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'auth';

const SIGNED_IN = 'portal/auth/SIGNED_IN';

type User = $npm$firebase$auth$User;

export type Action = {|
  type: typeof SIGNED_IN,
  user: User
|};

export type State = {
  user?: User
};

const initialState: State = {};

// Root Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SIGNED_IN:
      return {
        ...state,
        user: action.user
      };
    default:
      return state;
  }
};

// Action Creators

export const signedIn = (user: User): Action => ({
  type: SIGNED_IN,
  user
});

export type initializeAuthType = () => (
  dispatch: Dispatch,
  getState: GetState
) => void;

export const initializeAuth: initializeAuthType = () => (
  dispatch,
  getState
) => {
  // firebase.auth().signInWithRedirect(provider); されて戻ってきた
  firebase.auth().getRedirectResult();

  // ユーザーの情報を監視
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // User is signed in.
      dispatch(signedIn(user));

      if (process.env.NODE_ENV === 'production') {
        connectExternalService(user);
      }
    } else if (getState().user) {
      // No use is signed in.
      dispatch({
        type: 'RESET' // redux-reset
      });
    }
  });
};

export const signInWithGoogle = () => async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().useDeviceLanguage();

  if (window.innerWidth > 600) {
    // 画面が大きければポップアップ
    await firebase.auth().signInWithPopup(provider);
  } else {
    // 画面が小さければリダイレクト
    firebase.auth().signInWithRedirect(provider);
  }
};

export const signOut = () => () => {
  return firebase.auth().signOut();
};

function connectExternalService(user: User) {
  ((...args) => {
    for (const func of args) {
      try {
        func();
      } catch (error) {
        console.info(error);
      }
    }
  })(
    () => window.gtag('set', { user_id: user.uid }), // ログインしている user_id を使用してUser-ID を設定します
    () =>
      window.sessionstack('identify', {
        userId: user.uid,
        displayName: user.displayName
      })
  );
}
