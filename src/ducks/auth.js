// @flow
import firebase from 'firebase';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'auth';

const SIGNED_IN = 'portal/auth/SIGNED_IN';
const SIGNED_OUT = 'portal/auth/SIGNED_OUT';

type User = $npm$firebase$auth$User;

type ActionType =
  | {
    type: typeof SIGNED_IN,
    user: User
  }
  | {
    type: typeof SIGNED_OUT
  };

export type State = {
  user?: User
};

const initialState: State = {};

// Root Reducer
export default (state: State = initialState, action: ActionType): State => {
  switch (action.type) {
    case SIGNED_IN:
      return {
        ...state,
        user: action.user
      };
    case SIGNED_OUT:
      // delete state.user
      const { user, ...next } = state;
      return next;
    default:
      return state;
  }
};

// Action Creators

export const signedIn = (user: User): ActionType => ({
  type: SIGNED_IN,
  user
});

export const signedOut = (): ActionType => ({
  type: SIGNED_OUT
});

export const initializeAuth = () => (dispatch, getState: () => State) => {
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
      dispatch(signedOut());
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
    () => window.sessionstack('identify', { userId: user.uid, displayName: user.displayName })
  );
}
