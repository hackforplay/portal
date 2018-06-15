// @flow
import * as helpers from './helpers';
import type { Dispatch, GetState as GetStore } from './';
import type { WorkItemType } from '../ducks/work';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'officialWork';

// earybird または開発中の時は, earlybird 向けのステージを配信する
const { hostname } = window.location;
const isEarlybird =
  hostname.startsWith('earlybird') || hostname.startsWith('localhost');

type OfficialWorkType = {|
  pathname: string,
  replayable: boolean,
  work: WorkItemType
|};

type OfficialWorkDocumentType = {|
  pathname: string,
  replayable: boolean,
  workJsonUrl: string,
  earlybirdWorkJsonUrl: string
|};

const makeItem = (
  documentData: OfficialWorkDocumentType
): OfficialWorkType => ({
  pathname: documentData.pathname,
  replayable: documentData.replayable,
  work: helpers.has({
    id: '', // Document ID
    path: '', // Page path
    title: '',
    description: '',
    asset_url: isEarlybird
      ? documentData.earlybirdWorkJsonUrl
      : documentData.workJsonUrl,
    // additional structure
    visibility: 'public',
    viewsNum: 0,
    favsNum: 0,
    clearRate: 0,
    createdAt: '',
    updatedAt: null
  })
});

const LOAD = 'portal/officialWork/LOAD';
const SET = 'portal/officialWork/SET';
const EMPTY = 'portal/officialWork/EMPTY';
const INVALID = 'portal/officialWork/INVALID';

export type Action =
  | {|
      +type: 'portal/officialWork/LOAD',
      +pathname: string
    |}
  | {|
      +type: 'portal/officialWork/SET',
      +payload: OfficialWorkType
    |}
  | {|
      +type: 'portal/officialWork/EMPTY',
      +pathname: string
    |}
  | {|
      +type: 'portal/officialWork/INVALID',
      +pathname: string,
      +error: string
    |};

export type State = {
  byPathname: {
    [string]: OfficialWorkType
  }
};

const initialState: State = {
  byPathname: {
    '/officials/hack-rpg': makeItem({
      pathname: '/officials/hack-rpg',
      replayable: false,
      workJsonUrl: `https://hackforplayofficial-production.herokuapp.com/hack-rpg/index.json`,
      earlybirdWorkJsonUrl: `https://hackforplayofficial-earlybird.herokuapp.com/hack-rpg/index.json`
    }),
    '/officials/make-rpg': makeItem({
      pathname: '/officials/make-rpg',
      replayable: true,
      workJsonUrl: `https://hackforplayofficial-production.herokuapp.com/make-rpg/index.json`,
      earlybirdWorkJsonUrl: `https://hackforplayofficial-earlybird.herokuapp.com/make-rpg/index.json`
    }),
    '/officials/pg-colosseum': makeItem({
      pathname: '/officials/pg-colosseum',
      replayable: false,
      workJsonUrl: `https://pg-colosseum.hackforplay.xyz/make-rpg.json`,
      earlybirdWorkJsonUrl: `https://pg-colosseum.hackforplay.xyz/make-rpg.json`
    })
  }
};

// Root Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        byPathname: {
          ...state.byPathname,
          [action.pathname]: {
            pathname: action.pathname,
            replayable: false,
            work: helpers.processing()
          }
        }
      };
    case SET:
      return {
        ...state,
        byPathname: {
          ...state.byPathname,
          [action.payload.pathname]: action.payload
        }
      };
    case EMPTY:
      return {
        ...state,
        byPathname: {
          ...state.byPathname,
          [action.pathname]: {
            pathname: action.pathname,
            replayable: false,
            work: helpers.empty()
          }
        }
      };
    case INVALID:
      return {
        ...state,
        byPathname: {
          ...state.byPathname,
          [action.pathname]: {
            pathname: action.pathname,
            replayable: false,
            work: helpers.invalid(action.error)
          }
        }
      };
    default:
      return state;
  }
};

export const load = (pathname: string): Action => ({
  type: LOAD,
  pathname
});

export const set = (payload: OfficialWorkType): Action => ({
  type: SET,
  payload
});

export const empty = (pathname: string): Action => ({
  type: EMPTY,
  pathname
});

export const invalid = (pathname: string, error: string): Action => ({
  type: INVALID,
  pathname,
  error
});

export function get(
  store: $Call<GetStore>,
  pathname: string
): OfficialWorkType {
  const state = getState(store);
  return (
    state.byPathname[pathname] || {
      pathname,
      replayable: false,
      work: helpers.initialized()
    }
  );
}

export function getState(store: $Call<GetStore>): State {
  return store[storeName];
}
