// @flow
import type { Statefull } from './helpers';
import type { UserType } from './user';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'work';

const LOAD_LIST = 'portal/work/LOAD_LIST';
const SET_LIST = 'portal/work/SET_LIST';
const LOAD_USERS = 'portal/work/LOAD_USERS';
const SET_USERS = 'portal/work/SET_USERS';

type WorkData = {
  id: number,
  title: string,
  description?: string,
  image?: string,
  asset_url: ?string,
  search: string,
  url: string,
  author?: string,
  created_at: string,
  views: number,
  favs: number
};

export type WorkType = Statefull<WorkData>;
export type WorkCollectionType = Statefull<Array<WorkData>>;

type Action =
  | {
      type: typeof LOAD_LIST,
      listType: 'recommended' | 'trending'
    }
  | {
      type: typeof SET_LIST,
      listType: 'recommended' | 'trending',
      payload: Array<WorkData>
    }
  | {
      type: typeof LOAD_USERS,
      userId: string
    }
  | {
      type: typeof SET_USERS,
      userId: string,
      payload: Array<WorkData>
    };

export type State = {
  recommended: WorkCollectionType,
  trending: WorkCollectionType,
  byUserId: {
    [string]: WorkCollectionType
  },
  privates: WorkCollectionType
};

const initialState: State = {
  recommended: {
    data: [],
    isAvailable: false,
    isProcessing: false
  },
  trending: {
    data: [],
    isAvailable: false,
    isProcessing: false
  },
  byUserId: {},
  byEmail: {},
  privates: {
    data: [],
    isAvailable: false,
    isProcessing: false
  }
};

const listReducer = (
  state: WorkCollectionType,
  action: Action
): WorkCollectionType => {
  switch (action.type) {
    case LOAD_LIST:
    case LOAD_USERS:
      return {
        isAvailable: false,
        isProcessing: true,
        data: []
      };
    case SET_LIST:
    case SET_USERS:
      return action.payload.length > 0
        ? {
            isAvailable: true,
            isProcessing: false,
            isEmpty: false,
            data: action.payload
          }
        : {
            isAvailable: false,
            isProcessing: false,
            isEmpty: true
          };
    default:
      return state;
  }
};

// Root Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case LOAD_LIST:
    case SET_LIST:
      return {
        ...state,
        [action.listType]: listReducer(state[action.listType], action)
      };

    case LOAD_USERS:
    case SET_USERS:
      return {
        ...state,
        byUserId: {
          ...state.byUserId,
          [action.userId]: listReducer(state.byUserId[action.userId], action)
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
}): Promise<{ data: Array<WorkData> }> => {
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

export const loadRecommended = (): Action => ({
  type: LOAD_LIST,
  listType: 'recommended'
});

export const loadTrending = (): Action => ({
  type: LOAD_LIST,
  listType: 'trending'
});

export const addRecommended = (payload: Array<WorkData>): Action => ({
  type: SET_LIST,
  listType: 'recommended',
  payload
});

export const addTrending = (payload: Array<WorkData>): Action => ({
  type: SET_LIST,
  listType: 'trending',
  payload
});

export const loadWorksByUser = (userId: string): Action => ({
  type: LOAD_USERS,
  userId
});

export const setWorksByUser = (
  userId: string,
  payload: Array<WorkData>
): Action => ({
  type: SET_USERS,
  userId,
  payload
});

export const fetchRecommendedWorks = () => async (
  dispatch,
  getState: () => { work: State }
) => {
  const state = getState().work;
  if (state.recommended.isProcessing || state.recommended.isAvailable) {
    // すでにリクエストを送信しているか、取得済み
    return;
  }

  try {
    dispatch(loadRecommended());
    // TODO: 手動ピックアップ
    const result = await request({
      sort: 'created_at',
      direction: 'desc',
      kit_identifier: 'com.feeles.make-rpg'
    });
    dispatch(addRecommended(result.data));
  } catch (error) {
    // dispatch({ type: LOAD_FAILUAR, payload: error });
  }
};

export const fetchTrendingWorks = () => async (
  dispatch,
  getState: () => { work: State }
) => {
  const state = getState().work;
  if (state.trending.isProcessing || state.trending.isAvailable) {
    // すでにリクエストを送信しているか、取得済み
    return;
  }

  try {
    dispatch(loadTrending());
    const result = await request({
      sort: 'favs',
      direction: 'desc',
      kit_identifier: 'com.feeles.make-rpg'
    });
    dispatch(addTrending(result.data));
  } catch (error) {
    // dispatch({ type: LOAD_FAILUAR, payload: error });
  }
};

export const fetchWorksByUser = (user: UserType) => async (
  dispatch,
  getState: () => { work: State }
) => {
  if (!user.isAvailable) {
    // ユーザーのデータがない
    return;
  }
  // 今の状態
  const works = getWorksByUserId(getState(), user.data.uid);
  if (works.isProcessing || works.isAvailable) {
    // すでにリクエストを送信しているか、取得済み
    return;
  }
  // リクエスト
  try {
    dispatch(loadWorksByUser(user.data.uid));
    const response = await fetch(
      `${endpoint}/productsByEmail?email=${encodeURIComponent(user.data.email)}`
    );
    const text = await response.text();
    const result = JSON.parse(text);
    dispatch(setWorksByUser(user.data.uid, result));
  } catch (error) {
    console.error(error);
  }
};

export function getWorksByUserId(
  state: { work: State },
  uid: string
): WorkCollectionType {
  return (
    state.work.byUserId[uid] || {
      isAvailable: false,
      isProcessing: false
    }
  );
}
