// @flow
import firebase from 'firebase';
import 'firebase/firestore';

import * as trending from './trending';
import * as helpers from './helpers';
import type { Statefull } from './helpers';
import type { UserType } from './user';
import type { Dispatch, GetState } from './';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'work';

// Firestore にあるデータ
const LOAD = 'portal/work/LOAD';
const SET = 'portal/work/SET';
const EMPTY = 'portal/work/EMPTY';
const INVALID = 'portal/work/INVALID';
const VIEW = 'portal/work/VIEW';

// Heroku にあるデータ
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
  // additional structure
  +visibility: VisibilityType,
  +uid?: string,
  +thumbnailStoragePath?: string,
  +assetStoragePath?: string,
  +viewsNum: number,
  +clearRate: number,
  +favsNum: number,
  +createdAt: string | Date,
  +updatedAt: string | Date | null
};

type migrateType = (old: WorkData) => WorkData;
const migrate: migrateType = old => ({
  ...old,
  id: old.id,
  path: `/products/${old.search || old.id}`,
  title: old.title,
  description: old.description,
  author: old.author,
  viewsNum: old.views || 0,
  clearRate: 0,
  favsNum: old.favs || 0,
  visibility: 'public',
  createdAt: old.created_at || '',
  updatedAt: null,
  image: old.image, // Backword compatibility
  asset_url: old.asset_url, // Backword compatibility
  search: old.search, // Backword compatibility
  url: old.url // Backword compatibility
});

export type WorkItemType = Statefull<WorkData>;
export type WorkCollectionType = Statefull<Array<WorkData>>;
type listType = 'recommended' | 'trending' | 'pickup';

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
  pickup: WorkCollectionType,
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
  pickup: helpers.initialized(),
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
    default:
      return state;
  }
};

// Action Creators

const endpoint = 'https://www.feeles.com/api/v1';

const request = (query: {
  page?: number,
  sort?: 'created_at' | 'favs',
  direction?: 'asc' | 'desc',
  q?: string,
  // ids?: Array<string>,
  original?: string,
  kit_identifier?: string
}): Promise<{
  data: Array<WorkData>
}> => {
  let params = '';
  for (const key of Object.keys(query)) {
    const value = query[key];
    if (value) {
      params += `&${key}=${encodeURIComponent(value + '')}`;
    }
  }
  params = params ? `${params.substr(1)}` : '';

  return fetch(`${endpoint}/products?${params}`)
    .then(response => response.text())
    .then(text => JSON.parse(text));
};

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
  getState: GetState
) => Promise<void>;

export const fetchRecommendedWorks: fetchRecommendedWorksType = () => async (
  dispatch,
  getState
) => {
  const state = getState().work;
  if (!helpers.isFetchNeeded(state.recommended)) return;

  dispatch(loadList('recommended'));
  try {
    const works = [];
    // Firestore から取得
    const querySnapshot = await firebase
      .firestore()
      .collection('works')
      .where('visibility', '==', 'public')
      .orderBy('createdAt', 'desc')
      .limit(15)
      .get();
    for (const snapshot of querySnapshot.docs) {
      works.push({
        ...snapshot.data(),
        id: snapshot.id,
        path: `/works/${snapshot.id}`
      });
    }
    // Heroku から取得
    const result = await request({
      sort: 'created_at',
      direction: 'desc',
      kit_identifier: 'com.feeles.make-rpg'
    });
    works.push(...result.data.map(migrate));

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
  getState: GetState
) => Promise<void>;

export const fetchTrendingWorks: fetchTrendingWorksType = () => async (
  dispatch,
  getState
) => {
  const state = getState().work;
  if (!helpers.isFetchNeeded(state.trending)) return;

  try {
    dispatch(loadList('trending'));
    const result = trending;
    dispatch(setList('trending', result.data.map(migrate)));
  } catch (error) {
    // dispatch({ type: LOAD_FAILUAR, payload: error });
  }
};

export type fetchPickupWorksType = () => (
  dispatch: Dispatch,
  getState: GetState
) => Promise<void>;

export const fetchPickupWorks: fetchPickupWorksType = () => async (
  dispatch,
  getState
) => {
  const state = getState().work;
  if (!helpers.isFetchNeeded(state.pickup)) return;

  try {
    dispatch(loadList('pickup'));
    const result = await import('./pickup.js');
    dispatch(setList('pickup', result.data.map(migrate)));
  } catch (error) {
    // dispatch({ type: LOAD_FAILUAR, payload: error });
  }
};

export type fetchWorksByUserType = (
  user: UserType
) => (dispatch: Dispatch, getState: GetState) => Promise<void>;

export const fetchWorksByUser: fetchWorksByUserType = user => async (
  dispatch,
  getState
) => {
  const userData = user.data;
  if (!userData) {
    // ユーザーのデータがない
    return;
  }
  const { uid, email } = userData;
  // 今の状態
  const works = getWorksByUserId(getState(), uid);
  if (!helpers.isFetchNeeded(works)) return;

  // リクエスト
  dispatch(loadUsers(uid));
  try {
    const works = [];
    // Firestore から取得
    let query = firebase
      .firestore()
      .collection('works')
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc');
    // 自分かどうか
    const authUser = getState().auth.user;
    if (!authUser || authUser.uid !== userData.uid) {
      // 自分ではない
      query = query.where('visibility', '==', 'public');
    }
    const querySnapshot = await query.get();
    for (const snapshot of querySnapshot.docs) {
      works.push({
        ...snapshot.data(),
        id: snapshot.id,
        path: `/works/${snapshot.id}`
      });
    }
    // Heroku から取得
    const response = await fetch(
      `${endpoint}/productsByEmail?email=${encodeURIComponent(email)}`
    );
    const json = await response.text();
    const results = JSON.parse(json);
    works.push(...results.map(migrate));
    // マージしてセット
    dispatch(setUsers(uid, works));
  } catch (error) {
    console.error(error);
  }
};

export type fetchWorkByPathType = (
  path: string
) => (dispatch: Dispatch, getState: GetState) => Promise<void>;

export const fetchWorkByPath: fetchWorkByPathType = path => async (
  dispatch,
  getState
) => {
  // 今の状態
  const work = getWorkByPath(getState(), path);
  if (!helpers.isFetchNeeded(work)) return;

  // リクエスト
  dispatch(load(path));
  const [, collection, id] = path.split('/');
  try {
    switch (collection) {
      case 'works':
        const snapshot = await firebase
          .firestore()
          .collection(collection)
          .doc(id)
          .get();
        if (snapshot.exists) {
          dispatch(
            set({
              ...snapshot.data(),
              id,
              path
            })
          );
        } else {
          dispatch(empty(path));
        }
        break;
      case 'products':
        const response = await fetch(`${endpoint}/products/${id}`);
        if (response.ok) {
          const json = await response.text();
          const result = JSON.parse(json);
          dispatch(set(migrate(result)));
        } else {
          // エラーレスポンス
          if (response.status === 404) {
            dispatch(empty(path));
          } else {
            dispatch(invalid(path, response.statusText));
          }
        }
        break;
      default:
        const error = new Error(`Unexpected work path ${path}`);
        error.name = 'invalid-path';
        throw error;
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
) => (dispatch: Dispatch, getState: GetState) => Promise<void>;

export const searchWorks: searchWorksType = query => async (
  dispatch,
  getState
) => {
  if (!query) {
    // クエリが空
    return;
  }
  // 今の状態
  const { search } = getState().work;
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
    // Heroku から取得
    const result = await request({
      q: query
    });
    works.push(...result.data.map(migrate));
    dispatch(searchResult(query, works));
  } catch (error) {
    dispatch(searchFailed(query, error.message));
    console.error(error);
  }
};

export type addWorkViewType = (
  path: string
) => (dispatch: Dispatch, getState: GetState) => Promise<*>;

export const addWorkView: addWorkViewType = path => async (
  dispatch,
  getState
) => {
  const { auth: { user } } = getState();

  if (!path.startsWith('/works')) {
    // Firestore にデータがないステージならスルー
    return;
  }

  const work = getWorkByPath(getState(), path);
  if (!work.data || (user && work.data && work.data.uid === user.uid)) {
    // ステージがサーバーにないか, 自分のステージである場合はスルー
    return;
  }

  // ステージの views コレクションにドキュメントを追加
  // works の histories にも自動で追加される
  const ref = await firebase
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
) => (dispatch: Dispatch, getState: GetState) => Promise<*>;

export const addWorkViewLabel: addWorkViewLabelType = (
  path,
  name,
  value
) => async (dispatch, getState) => {
  const { work: { currentView } } = getState();
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

export function getWorksByUserId(
  state: $Call<GetState>,
  uid: string
): WorkCollectionType {
  return state.work.byUserId[uid] || helpers.initialized();
}

export function getWorkByPath(
  state: $Call<GetState>,
  path: string
): WorkItemType {
  return state.work.byPath[path] || helpers.initialized();
}

export function isAuthUsersWork(state: $Call<GetState>, path: string) {
  const { auth: { user } } = state;
  if (!user) {
    // ログインしていない
    return false;
  }
  const work = getWorkByPath(state, path);
  return Boolean(work.data && work.data.uid === user.uid);
}
