// @flow
import firebase from 'firebase';

import * as helpers from './helpers';
import type { Statefull } from './helpers';

// 最終的な Root Reducere の中で、ここで管理している State が格納される名前
export const storeName: string = 'pcRanking';

const LOAD_RECORDS = 'portal/pcRanking/LOAD_RECORDS';
const SET_RECORDS = 'portal/pcRanking/SET_RECORDS';

type RecordData = {
  id: string,
  cheat: boolean,
  createdAt: string,
  lastTime: number,
  name: string,
  rating: number,
  score: number,
  stage: string
};

// created_at => createdAt
const fixData = (snapShot: firebase.firestore.DocumentSnapshot): RecordData => {
  const { created_at, ...last } = snapShot.data();
  return { id: snapShot.id, createdAt: created_at, ...last };
};

export type RecordType = Statefull<RecordData>;
export type RecordCollectionType = Statefull<Array<RecordData>>;

type Action =
  | {
      type: typeof LOAD_RECORDS,
      stage: string
    }
  | {
      type: typeof SET_RECORDS,
      stage: string,
      payload: Array<RecordData>
    };

export type State = {
  byStage: {
    [string]: RecordCollectionType
  }
};

const initialState: State = {
  byStage: {}
};

const recordsReducer = (
  state: RecordCollectionType,
  action: Action
): RecordCollectionType => {
  switch (action.type) {
    case LOAD_RECORDS:
      return helpers.initialized();
    case SET_RECORDS:
      return action.payload.length > 0
        ? helpers.has(action.payload)
        : helpers.empty();
    default:
      return state;
  }
};

// Root Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case LOAD_RECORDS:
    case SET_RECORDS:
      return {
        ...state,
        byStage: {
          ...state.byStage,
          [action.stage]: recordsReducer(state[action.stage], action)
        }
      };
    default:
      return state;
  }
};

// Initialize Firebase Connection

const app = firebase.initializeApp(
  {
    apiKey: 'AIzaSyCVt3IbyRsuEmgUsSF5cOz1zQ8KbiJJqk0',
    authDomain: 'new-rpg.firebaseapp.com',
    databaseURL: 'https://new-rpg.firebaseio.com',
    projectId: 'new-rpg'
  },
  'new-rpg'
);

// Action Creators

export const load = (stage: string): Action => ({
  type: LOAD_RECORDS,
  stage
});

export const set = (stage: string, payload: Array<RecordData>): Action => ({
  type: SET_RECORDS,
  stage,
  payload
});

export type fetchRecordsByStageType = (
  stage: string
) => (
  dispatch: (action: Action) => void,
  getState: () => { pcRanking: State }
) => Promise<void>;

export const fetchRecordsByStage: fetchRecordsByStageType = stage => async (
  dispatch,
  getState
) => {
  const current = getRecordsByStage(getState(), stage);
  if (current.isProcessing || current.isAvailable || current.isEmpty) {
    // すでにリクエストを送信しているか、取得済みか、データが空
    return;
  }

  try {
    dispatch(load(stage));

    await app
      .firestore()
      .collection('records')
      .where('stage', '==', stage)
      .orderBy('rating', 'desc')
      .onSnapshot(snapShot => {
        const result = snapShot.docs.map(fixData);
        dispatch(set(stage, result));
      });
  } catch (error) {
    // dispatch({ type: LOAD_FAILUAR, payload: error });
  }
};

export function getRecordsByStage(
  state: { pcRanking: State },
  stage: string
): RecordCollectionType {
  return state.pcRanking.byStage[stage] || helpers.initialized();
}
