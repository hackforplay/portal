// @flow

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'work';

const LOAD = 'portal/work/LOAD';
const LOAD_SUCCESS = 'portal/work/LOAD_SUCCESS';
const LOAD_FAILUAR = 'portal/work/LOAD_FAILUAR';
const ADD_WORKS = 'portal/work/ADD_WORKS';

export type Work = {
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

type Action = {
  type: string,
  listType?: 'recommended' | 'trending',
  payload?: Array<Work>,
  error?: Error
};

export type State = {
  recommended: {
    data: Array<Work>,
    isProcessing: boolean
  },
  trending: {
    data: Array<Work>,
    isProcessing: boolean
  },
  byUserId: {
    [string]: Array<Work>
  },
  privates: Array<Work>
};

const initialState: State = {
  recommended: {
    data: [],
    isProcessing: false
  },
  trending: {
    data: [],
    isProcessing: false
  },
  byUserId: {
    xxxxxxxx: []
  },
  privates: []
};

// Root Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        isProcessing: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        isProcessing: false
      };
    case LOAD_FAILUAR:
      return {
        ...state,
        isProcessing: false
      };
    case ADD_WORKS:
      const { listType, payload } = action;
      if (listType && payload) {
        const data = state[listType].data.concat(payload);
        return {
          ...state,
          [listType]: {
            data,
            isProcessing: true
          }
        };
      }
      return state;
    default:
      return state;
  }
};

// Action Creators

const endpoint = 'https://www.feeles.com/api/v1/products';

const request = (query: {
  page?: number,
  sort?: 'created_at' | 'favs',
  direction?: 'asc' | 'desc',
  q?: string,
  // ids?: Array<string>,
  original?: string,
  kit_identifier?: string
}): Promise<{ data: Array<Work> }> => {
  let params = '';
  for (const key of Object.keys(query)) {
    const value = query[key];
    if (value) {
      params += `&${key}=${encodeURIComponent(value + '')}`;
    }
  }
  params = params ? `?${params.substr(1)}` : '';

  return fetch(endpoint + params)
    .then(response => response.text())
    .then(text => JSON.parse(text));
};

export const addRecommended = (payload: Array<Work>): Action => ({
  type: ADD_WORKS,
  listType: 'recommended',
  payload
});

export const addTrending = (payload: Array<Work>): Action => ({
  type: ADD_WORKS,
  listType: 'trending',
  payload
});

export const requestRecommendedWorks = () => async (dispatch, getState) => {
  const state: State = getState()[storeName];
  if (state.recommended.isProcessing) {
    // Now processing
    return;
  }
  if (state.recommended.data.length > 0) {
    // Have loaded
    return;
  }

  try {
    dispatch({ type: LOAD });
    // TODO: 手動ピックアップ
    const result = await request({
      sort: 'created_at',
      direction: 'desc',
      kit_identifier: 'com.feeles.make-rpg'
    });
    dispatch({ type: LOAD_SUCCESS });
    dispatch(addRecommended(result.data));
  } catch (error) {
    dispatch({ type: LOAD_FAILUAR, payload: error });
  }
};

export const requestTrendingWorks = () => async (dispatch, getState) => {
  const state: State = getState()[storeName];
  if (state.trending.isProcessing) {
    // Now isProcessing
    return;
  }
  if (state.trending.data.length > 0) {
    // Have loaded
    return;
  }

  try {
    dispatch({ type: LOAD });
    const result = await request({
      sort: 'favs',
      direction: 'desc',
      kit_identifier: 'com.feeles.make-rpg'
    });
    dispatch({ type: LOAD_SUCCESS });
    dispatch(addTrending(result.data));
  } catch (error) {
    dispatch({ type: LOAD_FAILUAR, payload: error });
  }
};
