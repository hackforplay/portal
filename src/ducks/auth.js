// @flow
import firebase from 'firebase';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'auth';

const SIGN_IN = 'portal/auth/SIGN_IN';
const SIGN_OUT = 'portal/auth/SIGN_OUT';

type UserType = {
  uid: string,
  displayName: ?string,
  email: ?string,
  photoURL: ?string,
  worksNum: number
};

type ActionType = {
  type: string,
  user?: UserType
};

export type State = {
  user?: UserType
};

const initialState: State = {};

// Root Reducer
export default (state: State = initialState, action: ActionType): State => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        user: action.user
      };
    case SIGN_OUT:
      const { user, ...next } = state;
      return next;
    default:
      return state;
  }
};

// Action Creators

export const signIn = (user: UserType): ActionType => ({
  type: SIGN_IN,
  user
});

export const signOut = (): ActionType => ({
  type: SIGN_OUT
});

export const initializeAuth = () => (dispatch, getState: () => State) => {
  // firebase.auth().signInWithRedirect(provider); されて戻ってきた
  firebase.auth().getRedirectResult();

  // ユーザーの情報を監視
  firebase.auth().onAuthStateChanged(authUser => {
    if (authUser) {
      // User is signed in.
      const { displayName, email, uid, photoURL } = authUser;
      const user = { displayName, email, uid, photoURL, worksNum: 0 };
      dispatch(signIn(user));
    } else if (getState().user) {
      // No use is signed in.
      dispatch(signOut());
    }
  });
};

export const signInWithGoogle = () => async dispatch => {
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
