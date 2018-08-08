// @flow
import firebase from 'firebase';

import type { Dispatch, GetStore } from './type';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'auth';

const INIT = 'portal/auth/INIT';
const SIGNED_IN = 'portal/auth/SIGNED_IN';

type User = $npm$firebase$auth$User;

export type Action =
  | {|
      type: typeof INIT
    |}
  | {|
      type: typeof SIGNED_IN,
      user: User
    |};

export type State = {
  initialized: boolean,
  user?: User
};

const initialState: State = {
  initialized: false
};

// Root Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INIT:
      return {
        initialized: true
      };
    case SIGNED_IN:
      return {
        ...state,
        initialized: true,
        user: action.user
      };
    default:
      return state;
  }
};

// Action Creators

export const initialize = (): Action => ({
  type: INIT
});

export const signedIn = (user: User): Action => ({
  type: SIGNED_IN,
  user
});

export type initializeAuthType = () => (
  dispatch: Dispatch,
  getStore: GetStore
) => Promise<void>;

export const initializeAuth: initializeAuthType = () => async (
  dispatch,
  getStore
) => {
  // 現在のセッションまたはタブでのみ状態が維持され、ユーザーが認証を受けたタブやウィンドウを閉じるとクリアされる
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

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
    } else {
      if (getState(getStore()).user) {
        // サインイン => サインアウト
        dispatch({
          type: 'RESET' // redux-reset
        });
      } else {
        // サインインしていない状態
        dispatch(initialize());
      }
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

export function isAuthUser(state: $Call<GetStore>, uid: string) {
  const { auth: { user } } = state;
  return user && user.uid === uid;
}

export function getState(store: $Call<GetStore>): State {
  return store[storeName];
}
