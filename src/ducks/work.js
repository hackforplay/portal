// @flow
import firebase from 'firebase';
import 'firebase/firestore';

import * as helpers from './helpers';
import * as auth from './auth';
import * as makeImport from './make';
import type { Statefull } from './helpers';
import type { UserType } from './user';
import type { Dispatch, GetStore } from './type';
import * as storageAction from './storage';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'work';

// Firestore にあるデータ
const LOAD = 'portal/work/LOAD';
const SET = 'portal/work/SET';
const EMPTY = 'portal/work/EMPTY';
const INVALID = 'portal/work/INVALID';
const VIEW = 'portal/work/VIEW';
const LOAD_LIST = 'portal/work/LOAD_LIST';
const SET_LIST = 'portal/work/SET_LIST';
const INVALID_LIST = 'portal/work/INVALID_LIST';
const USERS_LOAD = 'portal/work/USERS_LOAD';
const USERS_SET = 'portal/work/USERS_SET';
const SEARCH_START = 'portal/work/SEARCH_START';
const SEARCH_RESULT = 'portal/work/SEARCH_RESULT';
const SEARCH_FAILED = 'portal/work/SEARCH_FAILED';

export type VisibilityType = 'public' | 'limited' | 'private';
export type WorkData = {
  +id: string, // Document ID
  +path: string, // Page path
  +title: string,
  +description: string,
  +image?: string,
  +asset_url?: string | null,
  +search?: string,
  +url?: string,
  +author?: string,
  +created_at?: string,
  +views?: number,
  +favs?: number,
  +assetVersion?: stirng,
  // additional structure
  +visibility: VisibilityType,
  +uid?: string,
  +earlybird?: boolean,
  +thumbnailStoragePath?: string,
  +assetStoragePath?: string,
  +viewsNum: number,
  +clearRate: number,
  +favsNum: number,
  +createdAt: string | Date,
  +updatedAt: string | Date | null
};

type FirestoreWork = {
  +title: string,
  +description: string,
  +author: string,
  +visibility: VisibilityType,
  +uid?: string,
  +earlybird?: boolean,
  +thumbnailStoragePath?: string,
  +assetStoragePath?: string,
  +viewsNum: number,
  +clearRate: number,
  +favsNum: number,
  +assetVersion?: stirng,
  +createdAt: FirestoreTimestamp,
  +updatedAt?: FirestoreTimestamp
};

export type GetWorkData = (
  snapshot: $npm$firebase$firestore$DocumentSnapshot
) => WorkData;

/**
 * Firestore のデータを変換して扱いやすい WorkData 型にする
 * @param {$npm$firebase$firestore$DocumentSnapshot} snapshot DocumentSnapshot
 */
export const getWorkData: GetWorkData = snapshot => {
  const data: FirestoreWork = (snapshot.data(): any);
  const { createdAt, updatedAt, ...workData } = data;
  const toDate = value =>
    !value
      ? undefined
      : typeof value.toDate === 'function'
      ? value.toDate()
      : new Date(value);
  return {
    ...workData,
    id: snapshot.id,
    path: `/works/${snapshot.id}`,
    createdAt: toDate(createdAt),
    updatedAt: toDate(updatedAt)
  };
};

export type WorkItemType = Statefull<WorkData>;
export type WorkCollectionType = Statefull<Array<WorkData>>;
type listType = 'recommended' | 'trending';

export type Action =
  | {|
      +type: 'portal/work/LOAD',
      +path: string
    |}
  | {|
      +type: 'portal/work/SET',
      +payload: WorkData
    |}
  | {|
      +type: 'portal/work/EMPTY',
      +path: string
    |}
  | {|
      +type: 'portal/work/INVALID',
      +path: string,
      +error: string
    |}
  | {|
      +type: 'portal/work/VIEW',
      +id: string,
      +path: string,
      +labels: {}
    |}
  | {|
      +type: 'portal/work/LOAD_LIST',
      +list: listType
    |}
  | {|
      +type: 'portal/work/SET_LIST',
      +list: listType,
      +payload: Array<WorkData>
    |}
  | {|
      +type: 'portal/work/INVALID_LIST',
      +list: listType,
      +error: string
    |}
  | {|
      +type: 'portal/work/USERS_LOAD',
      +uid: string
    |}
  | {|
      +type: 'portal/work/USERS_SET',
      +uid: string,
      +payload: Array<WorkData>
    |}
  | {|
      +type: 'portal/work/SEARCH_START',
      +query: string
    |}
  | {|
      +type: 'portal/work/SEARCH_RESULT',
      +query: string,
      +payload: Array<WorkData>
    |}
  | {|
      +type: 'portal/work/SEARCH_FAILED',
      +query: string,
      +error: string
    |};

export type State = {
  recommended: WorkCollectionType,
  trending: WorkCollectionType,
  byPath: {
    [string]: WorkItemType
  },
  byUserId: {
    [string]: WorkCollectionType
  },
  search: {
    query: string,
    result: WorkCollectionType
  },
  currentView: {
    path: string,
    id: string,
    labels: {}
  }
};

const initialState: State = {
  recommended: helpers.initialized(),
  trending: helpers.initialized(),
  byPath: {},
  byUserId: {},
  search: {
    query: '',
    result: helpers.initialized()
  },
  currentView: {
    path: '',
    id: '',
    labels: {}
  }
};

type ListReducer = (
  state: WorkCollectionType,
  action: Action
) => WorkCollectionType;

const listReducer: ListReducer = (state, action) => {
  switch (action.type) {
    case LOAD_LIST:
    case USERS_LOAD:
    case SEARCH_START:
      return helpers.processing();
    case SET_LIST:
    case USERS_SET:
    case SEARCH_RESULT:
      return action.payload.length > 0
        ? helpers.has(action.payload)
        : helpers.empty();
    case INVALID_LIST:
    case SEARCH_FAILED:
      return helpers.invalid(action.error);
    default:
      return state;
  }
};

type byPathReducerType = (
  state: {
    [string]: WorkItemType
  },
  action: Action
) => {
  [string]: WorkItemType
};

const byPathReducer: byPathReducerType = (state, action) => {
  switch (action.type) {
    case SET_LIST:
    case USERS_SET:
    case SEARCH_RESULT:
      if (action.payload.length < 1) {
        return state;
      }
      const byPath = {
        ...state
      };
      for (const data of action.payload) {
        byPath[data.path] = helpers.has(data);
      }
      return byPath;
    default:
      return state;
  }
};

// Root Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        byPath: {
          ...state.byPath,
          [action.path]: helpers.processing()
        }
      };
    case SET:
      return {
        ...state,
        byPath: {
          ...state.byPath,
          [action.payload.path]: helpers.has(action.payload)
        }
      };
    case EMPTY:
      return {
        ...state,
        byPath: {
          ...state.byPath,
          [action.path]: helpers.empty()
        }
      };
    case INVALID:
      return {
        ...state,
        byPath: {
          ...state.byPath,
          [action.path]: helpers.invalid(action.error)
        }
      };
    case LOAD_LIST:
    case SET_LIST:
    case INVALID_LIST:
      return {
        ...state,
        byPath: byPathReducer(state.byPath, action),
        [action.list]: listReducer(state[action.list], action)
      };
    case USERS_LOAD:
    case USERS_SET:
      return {
        ...state,
        byPath: byPathReducer(state.byPath, action),
        byUserId: {
          ...state.byUserId,
          [action.uid]: listReducer(state.byUserId[action.uid], action)
        }
      };
    case SEARCH_START:
      return {
        ...state,
        search: {
          query: action.query,
          result: listReducer(state.search.result, action)
        }
      };
    case SEARCH_RESULT:
    case SEARCH_FAILED:
      // まだそのクエリが残っているか？
      const search =
        state.search.query === action.query
          ? {
              query: action.query,
              result: listReducer(state.search.result, action)
            }
          : state.search; // すでに違うクエリで検索を始めている
      return {
        ...state,
        byPath: byPathReducer(state.byPath, action),
        search
      };
    case VIEW:
      const inherit =
        state.currentView.path === action.path ? state.currentView.labels : {};
      return {
        ...state,
        currentView: {
          path: action.path,
          id: action.id,
          labels: {
            ...inherit,
            ...action.labels
          }
        }
      };
    case makeImport.actions.push.done.type:
      // 自分の作品をアップロードし終わったときの Action
      const { workData } = action.payload.result;
      const currentCollection: ?WorkCollectionType =
        state.byUserId[workData.uid];
      const newCollection: WorkCollectionType = helpers.has(
        currentCollection
          ? // 先頭に追加
            [workData].concat(
              currentCollection.data.filter(item => item.path !== workData.path)
            )
          : [workData]
      );
      return {
        ...state,
        byPath: {
          ...state.byPath,
          [workData.path]: helpers.has(workData) // データを追加(更新)
        },
        byUserId: {
          ...state.byUserId,
          [action.uid]: newCollection
        }
      };
    default:
      return state;
  }
};

// Action Creators

export const load = (path: string): Action => ({
  type: LOAD,
  path
});

export const set = (payload: WorkData): Action => ({
  type: SET,
  payload
});

export const empty = (path: string): Action => ({
  type: EMPTY,
  path
});

export const invalid = (path: string, error: string): Action => ({
  type: INVALID,
  path,
  error
});

export const view = (id: string, path: string, labels: {}): Action => ({
  type: VIEW,
  id,
  path,
  labels
});

type loadListType = (list: listType) => Action;

export const loadList: loadListType = list => ({
  type: LOAD_LIST,
  list
});

type setListType = (list: listType, payload: Array<WorkData>) => Action;

export const setList: setListType = (list, payload) => ({
  type: SET_LIST,
  list,
  payload
});

type invalidListType = (list: listType, error: string) => Action;

export const invalidList: invalidListType = (list, error) => ({
  type: INVALID_LIST,
  list,
  error
});

export const loadUsers = (uid: string): Action => ({
  type: USERS_LOAD,
  uid
});

type setUsersType = (uid: string, payload: Array<WorkData>) => Action;

export const setUsers: setUsersType = (uid, payload) => ({
  type: USERS_SET,
  uid,
  payload
});

export const searchStart = (query: string): Action => ({
  type: SEARCH_START,
  query
});

type searchResultType = (query: string, payload: Array<WorkData>) => Action;

export const searchResult: searchResultType = (query, payload) => ({
  type: SEARCH_RESULT,
  query,
  payload
});

type searchFailedType = (query: string, error: string) => Action;

export const searchFailed: searchFailedType = (query, error) => ({
  type: SEARCH_FAILED,
  query,
  error
});

export type fetchRecommendedWorksType = () => (
  dispatch: Dispatch,
  getStore: GetStore
) => Promise<void>;

export const fetchRecommendedWorks: fetchRecommendedWorksType = () => async (
  dispatch,
  getStore
) => {
  const state = getState(getStore());
  if (!helpers.isFetchNeeded(state.recommended)) return;

  dispatch(loadList('recommended'));
  try {
    // Firestore から取得
    const querySnapshot: $npm$firebase$firestore$QuerySnapshot = await firebase
      .firestore()
      .collection('works')
      .where('visibility', '==', 'public')
      .orderBy('createdAt', 'desc')
      .limit(15)
      .get();
    const works: WorkData[] = querySnapshot.docs.map(getWorkData);
    dispatch(setList('recommended', works));
  } catch (error) {
    if (error.name === 'FirebaseError') {
      dispatch(invalidList('recommended', error.code));
    } else {
      dispatch(invalidList('recommended', error.message));
    }
    throw error;
  }
};

export type fetchTrendingWorksType = () => (
  dispatch: Dispatch,
  getStore: GetStore
) => Promise<void>;

export const fetchTrendingWorks: fetchTrendingWorksType = () => async (
  dispatch,
  getStore
) => {
  const state = getState(getStore());
  if (!helpers.isFetchNeeded(state.trending)) return;

  try {
    dispatch(loadList('trending'));
    const response = await fetch(
      process.env.REACT_APP_API_ENDPOINT + '/trendingWorks?page=1'
    );
    const json = await response.text();
    const {
      // page,
      docs
      // timestamp
    } = JSON.parse(json);
    dispatch(setList('trending', docs));
  } catch (error) {
    dispatch({ type: INVALID_LIST, list: 'trending', payload: error });
  }
};

export type fetchWorksByUserType = (
  user: UserType
) => (dispatch: Dispatch, getStore: GetStore) => Promise<void>;

export const fetchWorksByUser: fetchWorksByUserType = user => async (
  dispatch,
  getStore
) => {
  const userData = user.data;
  if (!userData) {
    // ユーザーのデータがない
    return;
  }
  const { uid } = userData;
  // 今の状態
  const works = getWorksByUserId(getStore(), uid);
  if (!helpers.isFetchNeeded(works)) return;

  // リクエスト
  dispatch(loadUsers(uid));
  try {
    const works: WorkData[] = [];
    // Firestore から取得
    let query = firebase
      .firestore()
      .collection('works')
      .where('uid', '==', uid)
      .where('visibility', '==', 'public')
      .orderBy('createdAt', 'desc')
      .limit(12); // TODO: もっと遡れるようにパラメータ化

    const querySnapshot: $npm$firebase$firestore$QuerySnapshot = await query.get();
    for (const snapshot of querySnapshot.docs) {
      works.push(getWorkData(snapshot));
    }
    // マージしてセット
    dispatch(setUsers(uid, works));
  } catch (error) {
    console.error(error);
  }
};

export type StartObserveOwnWorks = () => (
  dispatch: Dispatch,
  getStore: GetStore
) => Promise<void>;

export const startObserveOwnWorks: StartObserveOwnWorks = () => async (
  dispatch,
  getStore
) => {
  const authUser = auth.getState(getStore()).user;
  if (!authUser) {
    // ログインしていない
    return;
  }
  const { uid } = authUser;

  // 今の状態
  const works = getWorksByUserId(getStore(), uid);
  if (!helpers.isFetchNeeded(works)) return; // TODO: isObserved プロパティを追加してチェックする

  // リクエスト (Firestore)
  firebase
    .firestore()
    .collection('works')
    .where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .limit(50) // TODO: もっと遡れるように, パラメータ化
    .onSnapshot(
      querySnapshot => {
        const works = querySnapshot.docs.map(getWorkData);
        dispatch(setUsers(uid, works));
      },
      error => {
        console.error(error);
      }
    );
};

export type fetchWorkByPathType = (
  path: string
) => (dispatch: Dispatch, getStore: GetStore) => Promise<void>;

export const fetchWorkByPath: fetchWorkByPathType = path => async (
  dispatch,
  getStore
) => {
  // 今の状態
  const work = getWorkByPath(getStore(), path);
  if (!helpers.isFetchNeeded(work)) return;

  // リクエスト
  dispatch(load(path));
  const [, , id] = path.split('/');
  try {
    const snapshot: $npm$firebase$firestore$DocumentSnapshot = await firebase
      .firestore()
      .collection('works')
      .doc(id)
      .get();
    if (snapshot.exists) {
      dispatch(set(getWorkData(snapshot)));
    } else {
      dispatch(empty(path));
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
    if (error.name === 'FirebaseError') {
      dispatch(invalid(path, error.code));
    } else {
      dispatch(invalid(path, error.message));
    }
  }
};

export type searchWorksType = (
  query: string
) => (dispatch: Dispatch, getStore: GetStore) => Promise<void>;

export const searchWorks: searchWorksType = query => async (
  dispatch,
  getStore
) => {
  if (!query) {
    // クエリが空
    return;
  }
  // 今の状態
  const { search } = getState(getStore());
  if (search.query === query) {
    // すでに同じクエリでリクエストを送信しているか、取得済みか、検索結果が空
    return;
  }
  // リクエスト
  dispatch(searchStart(query));
  try {
    const works = [];
    // Cloud Functions から取得
    if (process.env.REACT_APP_FIREBASE_CLOUD_FUNCTIONS) {
      const body = {
        query: {
          bool: {
            must: [
              {
                match: { visibility: 'public' }
              },
              {
                bool: {
                  should: [
                    { match: { title: query } },
                    { match: { description: query } },
                    { match: { author: query } }
                  ]
                }
              }
            ]
          }
        },
        sort: {
          createdAt: 'desc'
        },
        from: 0,
        size: 10
      };
      const url = `${
        process.env.REACT_APP_FIREBASE_CLOUD_FUNCTIONS
      }/elasticsearch/works/work`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const result = await response.json();
      if (result.version === 0) {
        works.push(...result.works);
      }
    }
    dispatch(searchResult(query, works));
  } catch (error) {
    dispatch(searchFailed(query, error.message));
    console.error(error);
  }
};

export type addWorkViewType = (
  path: string
) => (dispatch: Dispatch, getStore: GetStore) => Promise<*>;

export const addWorkView: addWorkViewType = path => async (
  dispatch,
  getStore
) => {
  const { user } = auth.getState(getStore());

  if (!path.startsWith('/works')) {
    // Firestore にデータがないステージならスルー
    return;
  }

  const work = getWorkByPath(getStore(), path);
  if (!work.data || (user && work.data && work.data.uid === user.uid)) {
    // ステージがサーバーにないか, 自分のステージである場合はスルー
    return;
  }

  // ステージの views コレクションにドキュメントを追加
  // works の histories にも自動で追加される
  const ref: any = await firebase
    .firestore()
    .collection(`${path}/views`)
    .add({
      uid: user ? user.uid : null,
      labels: {},
      createdAt: new Date()
    });
  dispatch(view(ref.id, path, {}));
};

export type addWorkViewLabelType = (
  path: string,
  name: string,
  value: string
) => (dispatch: Dispatch, getStore: GetStore) => Promise<*>;

export const addWorkViewLabel: addWorkViewLabelType = (
  path,
  name,
  value
) => async (dispatch, getStore) => {
  const { currentView } = getState(getStore());
  if (path !== currentView.path) {
    // 現在プレイ中のステージでないならスルー
    return;
  }
  if (currentView.labels[name] === value) {
    // すでに登録された値ならスルー
    return;
  }

  // labels を追加
  await firebase
    .firestore()
    .doc(`${path}/views/${currentView.id}`)
    .update({
      [`labels.${name}`]: value,
      updatedAt: new Date()
    });
  dispatch(view(currentView.id, path, { [name]: value }));
};

export type RemoveWork = (
  payload: WorkData
) => (dispatch: Dispatch, getStore: GetStore) => Promise<*>;

export const removeWork: RemoveWork = payload => async (dispatch, getState) => {
  try {
    // ストレージからデータを削除
    if (payload.assetStoragePath) {
      dispatch(storageAction.removeFile(payload.assetStoragePath));
    }
    if (payload.thumbnailStoragePath) {
      dispatch(storageAction.removeFile(payload.thumbnailStoragePath));
    }
    // DB から削除
    await firebase
      .firestore()
      .doc(payload.path)
      .delete();
    // その work を空とみなす
    dispatch(empty(payload.path));
  } catch (error) {
    console.error(error);
  }
};

export function getWorksByUserId(
  store: $Call<GetStore>,
  uid: string
): WorkCollectionType {
  return getState(store).byUserId[uid] || helpers.initialized();
}

export function getWorkByPath(
  store: $Call<GetStore>,
  path: string
): WorkItemType {
  return getState(store).byPath[path] || helpers.initialized();
}

export function isAuthUsersWork(store: $Call<GetStore>, path: string) {
  const { user } = auth.getState(store);
  if (!user) {
    // ログインしていない
    return false;
  }
  const work = getWorkByPath(store, path);
  return Boolean(work.data && work.data.uid === user.uid);
}

export function getState(store: $Call<GetStore>): State {
  return store[storeName];
}
