// @flow

import firebase from 'firebase';
import 'firebase/firestore';

import * as helpers from './helpers';
import * as auth from './auth';
import * as user from './user';
import type { Statefull } from './helpers';
import type { Dispatch, GetStore } from './';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'user';

// TODO: 実際にはページングやクエリに対応する Action が必要
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

export type Action =
  | {|
      type: typeof LOAD,
      uid: string
    |}
  | {|
      type: typeof SET,
      uid: string,
      user?: UserData
    |}
  | {|
      type: typeof EDIT,
      uid: string,
      payload: EditingUserData
    |}
  | {|
      type: typeof UPDATE,
      uid: string
    |};

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

const userReducer = (user: ?UserType, action: Action): ?UserType => {
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
  action: Action
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
export default (state: State = initialState, action: Action): State => {
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

export const loadUser = (uid: string): Action => ({
  type: LOAD,
  uid
});

export const setUser = (user: UserData): Action => ({
  type: SET,
  uid: user.uid,
  user
});

export const setUserNotFound = (uid: string): Action => ({
  type: SET,
  uid
});

type editUserType = (uid: string, editing: EditingUserData) => Action;

export const editUser: editUserType = (uid, editing) => ({
  type: EDIT,
  uid,
  payload: editing
});

export const editCancel = (uid: string): Action => ({
  type: EDIT_CANCEL,
  uid
});

export const updateUser = (uid: string): Action => ({
  type: UPDATE,
  uid
});

export type fetchUserIfNeededType = (
  uid: string
) => (dispatch: Dispatch, getStore: GetStore) => void;

export const fetchUserIfNeeded: fetchUserIfNeededType = uid => (
  dispatch,
  getStore
) => {
  // その UID が Store にあるか確認
  const currentUser = getUserByUid(getStore(), uid);
  if (!helpers.isFetchNeeded(currentUser)) return;

  // リクエストを送る
  dispatch(loadUser(uid));
  firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .onSnapshot(snapshot => {
      if (snapshot && snapshot.exists) {
        // ユーザー情報をストアに格納
        const user = { ...(snapshot.data(): any), uid: snapshot.id };
        dispatch(setUser(user));
      } else {
        // 存在しない UID
        dispatch(setUserNotFound(uid));
      }
    });
};

export type editAuthUserType = (
  editing: EditingUserData
) => (dispatch: Dispatch, getStore: GetStore) => void;

export const editAuthUser: editAuthUserType = editing => (
  dispatch,
  getStore
) => {
  // ログインユーザーを確認
  const { user } = auth.getState(getStore());
  if (!user) {
    // ログインしていない
    return;
  }
  dispatch(editUser(user.uid, editing));
};

export type cancelAuthUserEditingType = () => (
  dispatch: Dispatch,
  getStore: GetStore
) => void;

export const cancelAuthUserEditing: cancelAuthUserEditingType = () => (
  dispatch,
  getStore
) => {
  // ログインユーザーを確認
  const { user } = auth.getState(getStore());
  if (!user) {
    // ログインしていない
    return;
  }
  dispatch(editCancel(user.uid));
};

export type confirmAuthUserEditingType = () => (
  dispatch: Dispatch,
  getStore: GetStore
) => Promise<void>;

export const confirmAuthUserEditing: confirmAuthUserEditingType = () => async (
  dispatch,
  getStore
) => {
  // ログインユーザーを確認
  const authState = auth.getState(getStore());
  const uid = authState.user && authState.user.uid;
  if (!uid) {
    // ログインしていない
    return;
  }
  // 編集中のデータを取得
  const editing = user.getState(getStore()).editingByUid[uid];
  if (!editing) {
    // 編集中のデータがない
    return;
  }
  // アップデートを開始
  dispatch(updateUser(uid));
  await firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .update(editing);
};

// Helpers

export function getUserByUid(store: $Call<GetStore>, uid: string): UserType {
  return getState(store).byUid[uid] || helpers.initialized();
}

export function getState(store: $Call<GetStore>): State {
  return store[storeName];
}
