// @flow

import firebase from 'firebase';
import 'firebase/firestore';

import type { Statefull } from './helpers';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'user';

// TODO: 実際にはページングやクエリに対応する ActionType が必要
const LOAD = 'portal/user/LOAD';
const SET = 'portal/user/SET';

type UserData = {
  uid: string,
  displayName: string,
  email: string,
  photoURL: string,
  worksNum: number,
  createdAt: string
};

export type UserType = Statefull<UserData>;

type ActionType =
  | {
      type: typeof LOAD,
      uid: string
    }
  | {
      type: typeof SET,
      uid: string,
      user?: UserData
    };

export type State = {
  byUid: {
    [string]: ?UserType
  }
};

const initialState: State = {
  byUid: {}
};

// Reducers

const userReducer = (user: ?UserType, action: ActionType): ?UserType => {
  switch (action.type) {
    case LOAD:
      return {
        isAvailable: false,
        isProcessing: true
      };
    case SET:
      return action.user
        ? {
            isAvailable: true,
            isProcessing: false,
            isEmpty: false,
            data: action.user
          }
        : {
            isAvailable: false,
            isProcessing: false,
            isEmpty: true
          };
    default:
      return user;
  }
};

// Root Reducer
export default (state: State = initialState, action: ActionType): State => {
  switch (action.type) {
    case LOAD:
    case SET:
      const currentUser = state.byUid[action.uid];
      const byUid = {
        ...state.byUid,
        [action.uid]: userReducer(currentUser, action)
      };
      return {
        ...state,
        byUid
      };
    default:
      return state;
  }
};

// Action Creators

export const loadUser = (uid: string): ActionType => ({
  type: LOAD,
  uid
});

export const setUser = (user: UserData): ActionType => ({
  type: SET,
  uid: user.uid,
  user
});

export const setUserNotFound = (uid: string): ActionType => ({
  type: SET,
  uid
});

export const fetchUserIfNeeded = (uid: string) => (
  dispatch,
  getState: () => { user: State }
) => {
  // その UID が Store にあるか確認
  const currentUser = getUserByUid(getState(), uid);
  if (currentUser && (currentUser.isProcessing || currentUser.isAvailable)) {
    // すでにリクエストが送られているか、取得済み
    return;
  }
  // リクエストを送る
  dispatch(loadUser(uid));
  firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .onSnapshot(snapshot => {
      console.log('onSnapShot');
      if (snapshot && snapshot.exists) {
        // ユーザー情報をストアに格納
        const user = { ...snapshot.data(), uid: snapshot.id };
        dispatch(setUser(user));
      } else {
        // 存在しない UID
        dispatch(setUserNotFound(uid));
      }
    });
};

// Helpers

export function getUserByUid(state: { user: State }, uid: string): UserType {
  return (
    state.user.byUid[uid] || {
      isAvailable: false,
      isProcessing: false
    }
  );
}
