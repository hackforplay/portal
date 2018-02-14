// @flow
import type { Statefull } from './helpers';
import type { UserType } from './user';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'work';

const LOAD_ITEM = 'portal/work/LOAD_ITEM';
const SET_ITEM = 'portal/work/SET_ITEM';
const SET_ITEM_EMPTY = 'portal/work/SET_ITEM_EMPTY';
const LOAD_LIST = 'portal/work/LOAD_LIST';
const SET_LIST = 'portal/work/SET_LIST';
const LOAD_USERS = 'portal/work/LOAD_USERS';
const SET_USERS = 'portal/work/SET_USERS';
const SEARCH_START = 'portal/work/SEARCH_START';
const SEARCH_RESULT = 'portal/work/SEARCH_RESULT';

export type WorkData = {
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

export type WorkItemType = Statefull<WorkData>;
export type WorkCollectionType = Statefull<Array<WorkData>>;

type Action =
  | {
      type: typeof LOAD_ITEM,
      search: string
    }
  | {
      type: typeof SET_ITEM,
      payload: WorkData
    }
  | {
      type: typeof SET_ITEM_EMPTY,
      search: string
    }
  | {
      type: typeof LOAD_LIST,
      listType: 'recommended' | 'trending' | 'pickup'
    }
  | {
      type: typeof SET_LIST,
      listType: 'recommended' | 'trending' | 'pickup',
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
    }
  | {
      type: typeof SEARCH_START,
      query: string
    }
  | {
      type: typeof SEARCH_RESULT,
      query: string,
      payload: Array<WorkData>
    };

export type State = {
  recommended: WorkCollectionType,
  trending: WorkCollectionType,
  pickup: WorkCollectionType,
  byUserId: {
    [string]: WorkCollectionType
  },
  bySearch: {
    [string]: WorkItemType
  },
  search: {
    query: string,
    result: WorkCollectionType
  },
  privates: WorkCollectionType
};

const initialState: State = {
  recommended: {
    isAvailable: false,
    isProcessing: false
  },
  trending: {
    isAvailable: false,
    isProcessing: false
  },
  pickup: {
    isAvailable: false,
    isProcessing: false
  },
  byUserId: {},
  bySearch: {},
  search: {
    query: '',
    result: {
      isAvailable: false,
      isProcessing: false
    }
  },
  privates: {
    isAvailable: false,
    isProcessing: false
  }
};

type ListReducer = (
  state: WorkCollectionType,
  action: Action
) => WorkCollectionType;

const listReducer: ListReducer = (state, action) => {
  switch (action.type) {
    case LOAD_LIST:
    case LOAD_USERS:
    case SEARCH_START:
      return {
        isAvailable: false,
        isProcessing: true,
        data: []
      };
    case SET_LIST:
    case SET_USERS:
    case SEARCH_RESULT:
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
    case LOAD_ITEM:
      return {
        ...state,
        bySearch: {
          ...state.bySearch,
          [action.search]: {
            isAvailable: false,
            isProcessing: false
          }
        }
      };
    case SET_ITEM:
      return {
        ...state,
        bySearch: {
          ...state.bySearch,
          [action.payload.search]: {
            isAvailable: true,
            isProcessing: false,
            isEmpty: false,
            data: action.payload
          }
        }
      };
    case SET_ITEM_EMPTY:
      return {
        ...state,
        bySearch: {
          ...state.bySearch,
          [action.search]: {
            isAvailable: false,
            isProcessing: false,
            isEmpty: true
          }
        }
      };
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
    case SEARCH_START:
      return {
        ...state,
        search: {
          query: action.query,
          result: listReducer(state.search.result, action)
        }
      };
    case SEARCH_RESULT:
      // まだそのクエリが残っているか？
      return state.search.query === action.query
        ? {
            ...state,
            search: {
              query: action.query,
              result: listReducer(state.search.result, action)
            }
          }
        : state; // すでに違うクエリで検索を始めている
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

export const loadItem = (search: string): Action => ({
  type: LOAD_ITEM,
  search
});

export const setItem = (payload: WorkData): Action => ({
  type: SET_ITEM,
  payload
});

export const setItemEmpty = (search: string): Action => ({
  type: SET_ITEM_EMPTY,
  search
});

export const loadRecommended = (): Action => ({
  type: LOAD_LIST,
  listType: 'recommended'
});

export const loadTrending = (): Action => ({
  type: LOAD_LIST,
  listType: 'trending'
});

export const loadPickup = (): Action => ({
  type: LOAD_LIST,
  listType: 'pickup'
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

export const addPickup = (payload: Array<WorkData>): Action => ({
  type: SET_LIST,
  listType: 'pickup',
  payload
});

export const loadWorksByUser = (userId: string): Action => ({
  type: LOAD_USERS,
  userId
});

export const setItems = (payload: Array<WorkData>) => dispatch => {
  for (const item of payload) {
    dispatch(setItem(item));
  }
};

export const setWorksByUser = (
  userId: string,
  payload: Array<WorkData>
): Action => ({
  type: SET_USERS,
  userId,
  payload
});

export const searchStart = (query: string): Action => ({
  type: SEARCH_START,
  query
});

export const searchResult = (
  query: string,
  payload: Array<WorkData>
): Action => ({
  type: SEARCH_RESULT,
  query,
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
    dispatch(setItems(result.data));
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
    const result = await import('./trending.js');
    dispatch(addTrending(result.data));
    dispatch(setItems(result.data));
  } catch (error) {
    // dispatch({ type: LOAD_FAILUAR, payload: error });
  }
};

export const fetchPickupWorks = () => async (
  dispatch,
  getState: () => { work: State }
) => {
  const state = getState().work;
  if (state.pickup.isProcessing || state.pickup.isAvailable) {
    // すでにリクエストを送信しているか、取得済み
    return;
  }

  try {
    dispatch(loadPickup());
    const result = await import('./pickup.js');
    dispatch(addPickup(result.data));
    dispatch(setItems(result.data));
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
    dispatch(setItems(result));
  } catch (error) {
    console.error(error);
  }
};

export const fetchItemBySearch = (search: string) => async (
  dispatch,
  getState: () => { work: State }
) => {
  // 今の状態
  const work = getWorkBySearch(getState(), search);
  if (work.isProcessing || work.isAvailable) {
    // すでにリクエストを送信しているか、取得済み
    return;
  }
  // リクエスト
  try {
    dispatch(loadItem(search));
    const response = await fetch(
      `${endpoint}/products/${encodeURIComponent(search)}`
    );
    if (!response.ok) {
      // エラーレスポンス
      dispatch(setItemEmpty(search));
      return;
    }
    const text = await response.text();
    const result = JSON.parse(text);
    dispatch(setItem(result));
  } catch (error) {
    console.error(error);
  }
};

export const searchWorks = (query: string) => async (
  dispatch,
  getState: () => { work: State }
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
  try {
    dispatch(searchStart(query));
    const result = await request({
      q: query
    });
    dispatch(searchResult(query, result.data));
    dispatch(setItems(result.data));
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

export function getWorkBySearch(
  state: { work: State },
  search: string
): WorkItemType {
  return (
    state.work.bySearch[search] || {
      isAvailable: false,
      isProcessing: false
    }
  );
}
