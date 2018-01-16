// @flow

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'auth';

const SIGN_IN = 'portal/auth/SIGN_IN';
const SIGN_OUT = 'portal/auth/SIGN_OUT';

type Action = {
  type: string
};

export type State = {
  isSignedIn: boolean
};

const initialState: State = {
  isSignedIn: false
};

// Root Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        isSignedIn: true
      };
    case SIGN_OUT:
      return {
        ...state,
        isSignedIn: false
      };
    default:
      return state;
  }
};

// Action Creators

export const signIn = (): Action => ({
  type: SIGN_IN
});

export const signOut = (): Action => ({
  type: SIGN_OUT
});
