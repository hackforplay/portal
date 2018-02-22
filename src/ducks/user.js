// @flow

import firebase from 'firebase';
import 'firebase/firestore';

import type { Statefull } from './helpers';
import * as helpers from './helpers';
import * as auth from './auth';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'user';

// TODO: 実際にはページングやクエリに対応する ActionType が必要
const LOAD = 'portal/user/LOAD';
const SET = 'portal/user/SET';
const EDIT = 'portal/user/EDIT';
const EDIT_CANCEL = 'portal/user/EDIT_CANCEL';
const UPDATE = 'portal/user/UPDATE';

type UserData = {
  uid: string,
  displayName: string,
  email: string,
  photoURL: string,
  profileImagePath?: string,
  worksNum: number,
  createdAt: string
};

export type EditingUserData = {|
  displayName?: string,
  profileImagePath?: string
|};

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
    }
  | {
      type: typeof EDIT,
      uid: string,
      payload: EditingUserData
    }
  | {
      type: typeof UPDATE,
      uid: string
    };

export type State = {
  byUid: {
    [string]: UserType
  },
  editingByUid: {
    [string]: EditingUserData
  }
};

const initialState: State = {
  byUid: {},
  editingByUid: {}
};

// Reducers

const userReducer = (user: ?UserType, action: ActionType): ?UserType => {
  switch (action.type) {
    case LOAD:
      return helpers.processing();
    case SET:
      return action.user ? helpers.has(action.user) : helpers.empty();
    default:
      return user;
  }
};

type editingReducerType = (
  editingByUid: $PropertyType<State, 'editingByUid'>,
  action: ActionType
) => $PropertyType<State, 'editingByUid'>;

const editingReducer: editingReducerType = (editingByUid, action) => {
  switch (action.type) {
    case EDIT:
      // 編集中のデータに書き加える
      const editing = editingByUid[action.uid] || {};
      return {
        ...editingByUid,
        [action.uid]: { ...editing, ...action.payload }
      };
    case EDIT_CANCEL:
    case UPDATE:
      // 編集中のデータを消去する
      const shallow = { ...editingByUid };
      delete shallow[action.uid];
      return shallow;
    default:
      return editingByUid;
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
    case EDIT:
    case EDIT_CANCEL:
      // 編集中のデータを書き換えまたは消去する
      return {
        ...state,
        editingByUid: editingReducer(state.editingByUid, action)
      };
    case UPDATE:
      // 編集中のデータを消去し、状態をロード中にする
      return {
        ...state,
        byUid: {
          ...state.byUid,
          [action.uid]: helpers.processing()
        },
        editingByUid: editingReducer(state.editingByUid, action)
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

type editUserType = (uid: string, editing: EditingUserData) => ActionType;

export const editUser: editUserType = (uid, editing) => ({
  type: EDIT,
  uid,
  payload: editing
});

export const editCancel = (uid: string): ActionType => ({
  type: EDIT_CANCEL,
  uid
});

export const updateUser = (uid: string): ActionType => ({
  type: UPDATE,
  uid
});

export const fetchUserIfNeeded = (uid: string) => (
  dispatch,
  getState: () => { user: State }
) => {
  // その UID が Store にあるか確認
  const currentUser = getUserByUid(getState(), uid);
  if (currentUser.isProcessing || currentUser.isAvailable) {
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

export type editAuthUserType = (
  editing: EditingUserData
) => (dispatch, getState: () => { auth: auth.State }) => void;

export const editAuthUser: editAuthUserType = editing => (
  dispatch,
  getState
) => {
  // ログインユーザーを確認
  const { user } = getState().auth;
  if (!user) {
    // ログインしていない
    return;
  }
  dispatch(editUser(user.uid, editing));
};

export const cancelAuthUserEditing = () => (
  dispatch,
  getState: () => { auth: auth.State }
) => {
  // ログインユーザーを確認
  const { user } = getState().auth;
  if (!user) {
    // ログインしていない
    return;
  }
  dispatch(editCancel(user.uid));
};

export const confirmAuthUserEditing = () => async (
  dispatch,
  getState: () => { auth: auth.State, user: State }
) => {
  const state = getState();
  // ログインユーザーを確認
  const { user } = state.auth;
  if (!user) {
    // ログインしていない
    return;
  }
  // 編集中のデータを取得
  const editing = state.user.editingByUid[user.uid];
  if (!editing) {
    // 編集中のデータがない
    return;
  }
  // アップデートを開始
  dispatch(updateUser(user.uid));
  await firebase
    .firestore()
    .collection('users')
    .doc(user.uid)
    .update(editing);
};

// Helpers

export function getUserByUid(state: { user: State }, uid: string): UserType {
  return state.user.byUid[uid] || helpers.initialized();
}
