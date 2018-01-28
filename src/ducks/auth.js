// @flow

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'auth';

const SIGN_IN = 'portal/auth/SIGN_IN';
const SIGN_OUT = 'portal/auth/SIGN_OUT';

type UserType = {
  id: string,
  displayName: string,
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

export const signIn = (): ActionType => ({
  type: SIGN_IN
});

export const signOut = (): ActionType => ({
  type: SIGN_OUT
});

export const mockSignIn = (): ActionType => {
  const user: UserType = {
    id: 'xxxxxxxx',
    displayName: 'ユーザー名',
    worksNum: 56
  };
  return {
    type: SIGN_IN,
    user
  };
};
