// @flow
import { typeof FirestoreError as FirestoreErrorCode } from 'firebase/firestore';

import * as helpers from './helpers';
import type { Dispatch, GetStore } from './type';
import isEarlybird from '../utils/isEarlybird';
import type { WorkItemType } from '../ducks/work';

type FirestoreError = {
  code: FirestoreErrorCode,
  message: string,
  name: string,
  stack?: string
};

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'officialWork';

type OfficialWorkType = {|
  replayable: boolean,
  slaask: boolean,
  work: WorkItemType
|};

type OfficialWorkDocumentType = {|
  pathname: string,
  replayable: boolean,
  slaask: boolean,
  workJsonUrl: string,
  earlybirdWorkJsonUrl: string,
  assetVersion?: stirng
|};

const makeItem = (
  documentData: OfficialWorkDocumentType
): OfficialWorkType => ({
  replayable: documentData.replayable,
  slaask: documentData.slaask,
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
    updatedAt: null,
    assetVersion: documentData.assetVersion
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
      +pathname: string,
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
  byPathname: {}
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
            slaask: false,
            work: helpers.processing()
          }
        }
      };
    case SET:
      return {
        ...state,
        byPathname: {
          ...state.byPathname,
          [action.pathname]: action.payload
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
            slaask: false,
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
            slaask: false,
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

export const set = (pathname: string, payload: OfficialWorkType): Action => ({
  type: SET,
  pathname,
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

export const fetchWork = (pathname: string) => async (
  dispatch: Dispatch,
  getStore: GetStore
) => {
  // LOAD
  dispatch(load(pathname));
  try {
    // Cloud Functions から取得
    const response = await fetch(process.env.REACT_APP_API_ENDPOINT + pathname);
    if (response.ok) {
      const json = await response.text();
      const payload = JSON.parse(json);
      dispatch(set(pathname, makeItem(payload)));
    } else {
      dispatch(empty(pathname));
    }
  } catch (error) {
    const code = (error: FirestoreError).code;
    dispatch(invalid(pathname, code));
    console.error(error);
  }
};

export function get(
  store: $Call<GetStore>,
  pathname: string
): OfficialWorkType {
  const state = getState(store);
  return (
    state.byPathname[pathname] || {
      pathname,
      replayable: false,
      slaask: false,
      work: helpers.initialized()
    }
  );
}

export function getState(store: $Call<GetStore>): State {
  return store[storeName];
}
